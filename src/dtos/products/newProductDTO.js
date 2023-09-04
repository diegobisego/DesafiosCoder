export default class newProductDTO {
  constructor(
    title,
    description,
    code,
    price,
    quantity,
    category,
    thumbnails,
    owner
  ) {
    this.title = title
    this.description = description
    this.code = code
    this.price = price
    this.quantity = quantity
    this.category = category
    this.thumbnails = thumbnails || []
    this.owner = owner
  }
}
