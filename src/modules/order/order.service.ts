import { BadRequestException, Injectable } from "@nestjs/common";
import { Request } from "express";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { TcreateOrderBodyDto } from "../../common/types";
import { Address, Cart, Coupon, Order, Product, UsersCoupon } from "../../common/schemas";
import { calculateCartTotale } from "../../common/utils";
import { QrCodeService, ValidateCoupon } from "../../services";
import { OrderStatusType, PaymentMethodType } from "../../common/shared";
import { DateTime } from "luxon";

@Injectable()
export class OredrService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Address.name) private addressModel: Model<Address>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
    private readonly validateCoupon: ValidateCoupon,
    private readonly qrCodeService: QrCodeService,
  ) {}

  /**
   * 
   * @param {TcreateOrderBodyDto}body 
   * @param { Request | any}req 
   * 
   * @returns {{ order ,qrCodeDataURL}}
   */
  async createOredr(body: TcreateOrderBodyDto, req: Request | any):Promise<{order:Order,qrCodeDataURL:string}> {
    //featch data
    const userId = req.authUser._id;
    const {
      address,
      addressId,
      contactNumber,
      shippingFee,
      VAT,
      couponCode,
      paymentMethod,
    } = body;

    //check if user has already cart
    const cart: Cart | any = await this.cartModel
      .findOne({ userId })
      .populate('products.productId');
    if (!cart) throw new BadRequestException('Empty cart');

    //check if any product is sold out
    const isSoldOut = cart.products.find(
      (p: any) => p.productId.stock < p.quantity,
    );
    if (isSoldOut)
      throw new BadRequestException(
        `product ${isSoldOut.productId.title} is sold out`,
      );

    //total cart
    const subTotal = calculateCartTotale(cart.products);
    let total = subTotal + shippingFee + VAT;
    //coupon
    let coupon = null;
    if (couponCode) {
      coupon = await this.validateCoupon.validateCoupon(couponCode, userId);

      total =
        this.validateCoupon.applyCoupon(subTotal, coupon) + shippingFee + VAT;
    }

    //address
    if (!address && !addressId)
      throw new BadRequestException(`address required`);
    if (addressId) {
      const addressInfo = await this.addressModel.findOne({
        _id: addressId,
        userId,
      });
      if (!addressInfo) throw new BadRequestException('invalid address');
    }
    //order statues
    let orderStatus = OrderStatusType.PENDING;
    if (paymentMethod == PaymentMethodType.CASH)
      orderStatus = OrderStatusType.PLACED;
    //create
    const orderObj = new this.orderModel({
      address,
      addressId,
      products: cart.products,
      userId,
      contactNumber,
      subTotal,
      shippingFee,
      VAT,
      total,
      couponId: coupon?._id,
      paymentMethod,
      orderStatus,
      estimatedDeliveryDate: DateTime.now()
        .plus({ days: 7 })
        .toFormat('yyyy-MM-dd'),
    });
    await orderObj.save();

    //remove cart
    cart.products = [];
    await cart.save();


     //decrement stock

    for (const element of orderObj.products) {
      await this.productModel.updateOne({ _id: element.productId }, { $inc: { stock :-element.quantity} });
    }

 //increment useageCount
    if (orderObj.couponId) {
      const coupon = await this.couponModel.findById(orderObj.couponId);
      coupon.users.find((u:UsersCoupon) => u.userId.toString() == userId.toString()).useageCount++;
      await coupon.save();
    }
  

    //generate qrcode
    // const qrCode = await generateQRCode([orderObj.total, orderObj.userId]);
    const qrCodeDataURL = await this.qrCodeService.generateQrCode([orderObj.total, orderObj.userId]);

    //return
    return { order: orderObj ,qrCodeDataURL};
  }
}