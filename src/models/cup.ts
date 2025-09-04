interface GetTotalPrice {
  cupPrice: number;
  quantityAdditional: number;
  additional: { id: string; price: number }[];
}

const getTotalPrice = ({
  additional,
  cupPrice,
  quantityAdditional,
}: GetTotalPrice) => {
  let countAdditional = 0;

  const additionalPrice = additional.reduce((acc, { price }) => {
    if (price > 0) return acc + price;

    if (countAdditional < quantityAdditional) {
      countAdditional++;

      return acc;
    }

    return acc + 200;
  }, 0);

  return additionalPrice + cupPrice;
};
const Cup = {
  getTotalPrice,
};

export default Cup;
