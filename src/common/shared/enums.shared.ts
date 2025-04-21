export enum UserType{
    BUYER = 'buyer',
    ADMIN = 'admin',
}

export enum Gender{
    MALE= 'male',
    FEMALE= 'female'
}

export enum UserProviderType { 
    SYSTEM = 'system',
    GOOGLE = 'google',
}

export enum ProductBadges{
    NEW= "New",
    SALE= "Sale",
    BEST_SELLER= "Best Seller",
}

export enum DiscountType {
    PERCENT= "percent",
    FIXED= "fixed",
  };

  export enum CouponType{
    PERCENT= "percent",
    FIXED= "fixed",
  }
  export enum PaymentMethodType{
    STRIPE="stripe",
    PAYMOB="paymob",
    CASH="cash",
  }

  export enum OrderStatusType{
    PENDING="pending",
    PLACED="placed",
    CONFIRMED="confirmed",
    CANCELLD="cancelled",
    REFUNDED="refunded",
    DELIVERED="delivered",
    RETURNED="returned",
    DROPPED= "dropped",
    ONWAY="oneway",
  }

  export enum ReviewStatus  {
    PENDING= 'pending',
    ACCEPTD= 'accepted',
    REJECTED= 'rejected',
  }