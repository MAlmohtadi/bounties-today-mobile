export const END_POINTS = {
  login: '/api/user/login',
  register: '/api/user/register',
  update: '/api/user/update',
  getCheckoutInfo: '/api/checkout/getCheckoutInfo',
  getDeliveryInfo: '/api/checkout/getDeliveryInfo',
  getCouponByCode: '/api/coupons/getCouponByCode',
  addOrder: '/api/orders/addOrder',
  addFavorite: '/api/favorite/add',
  getLoyaltyInfo: '/api/user/getLoyaltyInfo',
  convertPointsToCoupon: '/api/user/convertPointsToCoupon',
  getUserCoupons: '/api/user/getUserCoupons',
  deleteFavorite: '/api/favorite/delete',
  deleteAllFavorite: '/api/favorite/deleteAll',
  getFavoriteProducts: '/api/favorite/getFavoriteProducts',
  getHomeInfo: '/api/home/getHomeInfo?isWholeSale=',
  getOfferProdcuts: '/api/offers/getOfferProdcuts',
  cancelOrder: '/api/orders/cancelOrder',
  updateOrderProducts: '/api/orders/updateOrderProducts',
  getOrderProducts: '/api/orders/getOrderProducts',
  getUserOrders: '/api/orders/getUserOrders',
  getProducts: '/api/products/getProducts',
  searchProducts: '/api/products/searchProducts',
  deleteUser: '/api/user/deleteUserInfo',
};

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};
