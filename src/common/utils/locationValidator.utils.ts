import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import axios from "axios";

export const validateLocation = async (
  type: 'country' | 'city',
  name: string,
): Promise<void> => {
  const url = `${process.env.LOCATION_VALIDATION_URL}${type}?name=${name}`;
  await axios
    .get(url, {
      headers: {
        'X-Api-Key': process.env.API_NINJAS_KEY,
      },
    })
    .then((data) => {
      if (!data?.data?.length)
        throw new BadRequestException(`Invalid ${type} name provided`);
    })
    .catch((error) => {
      throw new InternalServerErrorException(error);
    });
};