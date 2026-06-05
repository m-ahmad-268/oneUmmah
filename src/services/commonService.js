import { getApiRequest, postApiRequest } from '../API/request.js';



// http://localhost:8081/diamond/notifications/unread

const unreadUrl = 'notifications/unread';
const saveEventMasterUrl = 'eventMaster/saveWithDocsAdminPortal';
const getAllActiveEventTypesWithSubEventsUrl = 'eventType/getAllActiveEventTypesWithSubEvents';
// const getAllActiveCustomersUrl = 'customerMaster/getAllActiveDropDown';
const getAllActiveCustomersUrl = 'customerMaster/getAllData';
const generateEventCodeUrl = 'eventMaster/generateEventCode';
const generateCateringCodeUrl = 'cateringDelivery/generateCode';
const getAllVendorsUrl = 'vendorMaster/getAllData';
const getAllEventsUrl = 'eventMaster/getAllDataAdminPortal';
const searchEventsUrl = 'eventMaster/searchInEntityAndEventBudget';
// const searchEventsUrl = 'eventMaster/searchEntity';
const searchByBudgetStatusUrl = 'eventMaster/searchByBudgetStatus';
const getAllActiveCityUrl = 'cityMaster/getAllActive';
const logoutUrl = 'auth/logout';
const generateVendorCodeUrl = 'vendorMaster/generateVendorCode';
const generateEventTypeCodeUrl = 'eventType/generateEventCode';
const generateCustomerCodeUrl = 'customerMaster/generateCustomerCode';
const generateVenueCodeUrl = 'venueMaster/generateVenueMasterCode';
const getAllBookedCateringsUrl = 'cateringDelivery/getAllAdminPortal';
const saveOrUpdateAdminPortalUrl = 'cateringDelivery/saveOrUpdateAdminPortal';
const searchCateringUrl = 'cateringDelivery/searchInCateringAndEventBudget';
const getAllFoodsByTypeUrl = 'menuFoodMaster/getAllFoodsByType';
const getAllTypesUrl = 'admin/menu/getAllTypes';
const getByIdUrl = 'menu/item/getById';
// const treeUrl = 'menu/item/tree';
const treeUrl = 'menu/item/getAll';
const searchMenuItemUrl = 'menu/item/searchMenuItem';
const searchDecorPropertyValueUrl = 'decorCategoryMaster/searchDecorCategory';
const getAllActiveItemUrl = 'menu/item/getAllActive';
const getAllActiveItemsOfOtherSubCategoryUrl = 'menu/item/getAllActiveItemsOfOtherSubCategory';
const getAllActiveCompositeItemsUrl = 'menu/item/getAllActiveCompositeItems';
const getAllRolesUrl = 'menuItemRole/getAllRoles';
const getAllItemTypeUrl = 'itinerary/item-type/getAll';
const getAllItemUrl = 'admin/itinerary/item/getAll';
const getAllPriceVersionUrl = 'menu/price-version/getAll';
const getStatusListUrl = 'menu/price-version/getStatusList';
const generateCodePriceVersionUrl = 'menu/price-version/generateCode';
const getAllItineraryUnitsUrl = 'itinerary/assignment/getAllItineraryUnits';
const getAllAssignmentUrl = 'itinerary/assignment/getAll';
const getAllByRoleIdUrl = 'menu/item/getAllByRoleId';
const saveItemTypeUrl = 'itinerary/item-type/save';
const updateItemTypeUrl = 'itinerary/item-type/update';
const updateItineraryItemsUrl = 'admin/itinerary/item/update';
const updateItineraryAssignmentUrl = 'itinerary/assignment/update';
const createItineraryAssignmentUrl = 'itinerary/assignment/create';
const saveItineraryItemsUrl = 'admin/itinerary/item/save';
const savePriceVersionUrl = 'menu/price-version/create';
const updatePriceVersionUrl = 'menu/price-version/update';
const generateCodeItemTypeUrl = 'itinerary/item-type/generateCode';
const generateCodeItemUrl = 'admin/itinerary/item/generateCode';
const generateCodeAssignmentUrl = 'itinerary/assignment/generateCode';
const saveOrUpdateRolesUrl = 'menuItemRole/saveOrUpdate';
const getAllItemRolesUrl = 'menu/item/getAllRoles';
const getAllActiveMenuItemRolesUrl = 'menuItemRole/getAllActiveMenuItemRoles';
const getAllActiveCompositionRolesUrl = 'menuItemRole/getAllActiveCompositionRoles';
const priceEntryUrl = 'menu/price-entry';
const getAllCompositionUrl = 'menu/component/getAll';
const getGroupsByParentUrl = 'menu/component/getGroupsByParent';
const saveOrUpdateBulkUrl = 'menu/component/saveOrUpdateBulk';
const getAllMenuItemRolesUrl = 'menuItemRole/getAllMenuItemRoles';
const getValidParentByRoleUrl = 'menu/item/getValidParentsByRoleId';
const saveItemUrl = 'menu/item/save';
const getMenuUrl = 'admin/menu/getMenu';
const getMenuWithPricesUrl = 'admin/menu/getMenuWithPrices';
const updateItemUrl = 'menu/item/update';
const generateFoodItemCodeUrl = 'menu/item/generateCode';
const getByEventMasterIdUrl = 'eventPayment/getByEventMasterId';
const getAllPaymentMethodsUrl = 'eventPayment/getAllPaymentMethods';
const saveUpdatePaymentUrl = 'eventPayment/saveOrUpdate/WithDocs';
const getByCateringDeliveryBookingIdUrl = 'cateringPayment/getByCateringDeliveryBookingId';
const saveCateringPaymentUrl = 'cateringPayment/saveOrUpdate/WithDocs';
const getAllPriceUnitTypesUrl = 'menu/item/getAllPriceUnitTypes';
// const getAllBookedCateringsUrl = 'cateringDelivery/getAll';
export const eventClientSideUrl = 'report/eventClientSide';
export const eventReportUrl = 'report/event';
export const kitchen_itineraryReportUrl = 'report/kitchen_itinerary';


export const saveUpdatePayment = ((data, params) => {
    return postApiRequest(saveUpdatePaymentUrl, data || {});
});

export const getAllPriceUnitTypes = ((data, params) => {
    return postApiRequest(getAllPriceUnitTypesUrl, data || {});
});

export const getAllPaymentMethods = ((data, params) => {
    return postApiRequest(getAllPaymentMethodsUrl, data || {});
});

export const getPriceByEventMasterId = ((data, params) => {
    return postApiRequest(getByEventMasterIdUrl, data || {});
});

export const saveCateringPayment = ((data, params) => {
    return postApiRequest(saveCateringPaymentUrl, data || {});
});

export const getPriceByCateringDeliveryId = ((data, params) => {
    return postApiRequest(getByCateringDeliveryBookingIdUrl, data || {});
});

export const getMenuWithPrices = ((data, params) => {
    return postApiRequest(getMenuWithPricesUrl, data || {});
});

export const getMenu = ((data, params) => {
    return postApiRequest(getMenuUrl, data || {});
});

export const getUpdateItem = ((data, params) => {
    return postApiRequest(updateItemUrl, data || {});
});

export const getGroupsByParent = ((data, params) => {
    return postApiRequest(getGroupsByParentUrl, data || {});
});

export const createPriceEntry = ((id, data, params) => {
    return postApiRequest(`priceEntryUrl${id}/bulkAssign`, data || {});
});

export const getAllCompositions = ((data, params) => {
    return postApiRequest(getAllCompositionUrl, data || {});
});

export const getAllByRoleId = ((data, params) => {
    return postApiRequest(getAllByRoleIdUrl, data || {});
});

export const saveOrUpdateRoles = ((data, params) => {
    return postApiRequest(saveOrUpdateRolesUrl, data || {});
});

export const getAllItineraryUnits = ((data, params) => {
    return postApiRequest(getAllItineraryUnitsUrl, data || {});
});

export const generateCodeAssignment = ((data, params) => {
    return postApiRequest(generateCodeAssignmentUrl, data || {});
});

export const generateCodeItem = ((data, params) => {
    return postApiRequest(generateCodeItemUrl, data || {});
});

export const generateCodeItemType = ((data, params) => {
    return postApiRequest(generateCodeItemTypeUrl, data || {});
});

export const createAssignmentItem = ((data, params) => {
    return postApiRequest(createItineraryAssignmentUrl, data || {});
});

export const updateAssignmentItem = ((data, params) => {
    return postApiRequest(updateItineraryAssignmentUrl, data || {});
});

export const updateItinerayItem = ((data, params) => {
    return postApiRequest(updateItineraryItemsUrl, data || {});
});

export const upatePriceVersion = ((data, params) => {
    return postApiRequest(updatePriceVersionUrl, data || {});
});

export const savePriceVersion = ((data, params) => {
    return postApiRequest(savePriceVersionUrl, data || {});
});

export const saveItinerayItem = ((data, params) => {
    return postApiRequest(saveItineraryItemsUrl, data || {});
});

export const updateItemType = ((data, params) => {
    return postApiRequest(updateItemTypeUrl, data || {});
});

export const saveItemType = ((data, params) => {
    return postApiRequest(saveItemTypeUrl, data || {});
});

export const getAllAssignment = ((data, params) => {
    return postApiRequest(getAllAssignmentUrl, data || {});
});

export const generateCodePricing = ((data, params) => {
    return postApiRequest(generateCodePriceVersionUrl, data || {});
});

export const getStatusList = ((data, params) => {
    return postApiRequest(getStatusListUrl, data || {});
});

export const getAllPricing = ((data, params) => {
    return postApiRequest(getAllPriceVersionUrl, data || {});
});

export const getAllItem = ((data, params) => {
    return postApiRequest(getAllItemUrl, data || {});
});

export const getAllItemType = ((data, params) => {
    return postApiRequest(getAllItemTypeUrl, data || {});
});

export const getAllRoles = ((data, params) => {
    return postApiRequest(getAllRolesUrl, data || {});
});

export const saveOrUpdateBulk = ((data, params) => {
    return postApiRequest(saveOrUpdateBulkUrl, data || {});
});

export const getAllActiveCompositionRoles = ((data, params) => {
    return postApiRequest(getAllActiveCompositionRolesUrl, data || {});
});

export const getAllActiveMenuItemRole = ((data, params) => {
    return postApiRequest(getAllActiveMenuItemRolesUrl, data || {});
});

export const getSaveItem = ((data, params) => {
    return postApiRequest(saveItemUrl, data || {});
});

export const generateFoodItemCode = ((data, params) => {
    return postApiRequest(generateFoodItemCodeUrl, data || {});
});

export const getAllActiveItemsOfOtherSubCategory = ((data, params) => {
    return postApiRequest(getAllActiveItemsOfOtherSubCategoryUrl, data || {});
});

export const getAllActiveItem = ((data, params) => {
    return postApiRequest(getAllActiveItemUrl, data || {});
});

export const getAllActiveCompositeItems = ((data, params) => {
    return postApiRequest(getAllActiveCompositeItemsUrl, data || {});
});

export const getAllItemsTree = ((data, params) => {
    return postApiRequest(treeUrl, data || {});
});

export const searchMenuItemByKeyword = ((data, params) => {
    return postApiRequest(searchMenuItemUrl, data || {});
});

export const searchDecorPropertyValueByKeyword = (data) =>
    postApiRequest(searchDecorPropertyValueUrl, data || {});

export const getAllMenuItemRoles = ((data, params) => {
    return postApiRequest(getAllMenuItemRolesUrl, data || {});
});

export const getAllItemRoles = ((data, params) => {
    return postApiRequest(getAllItemRolesUrl, data || {});
});

export const getValidParentByRole = ((data, params) => {
    return postApiRequest(getValidParentByRoleUrl, data || {});
});

export const getAllMenuType = ((data, params) => {
    return postApiRequest(getAllTypesUrl, data || {});
});

export const getAllFoodsByType = ((data, params) => {
    return postApiRequest(getAllFoodsByTypeUrl, data || {});
});

export const getAllActiveEventTypesWithSubEvents = ((data, params) => {
    return postApiRequest(getAllActiveEventTypesWithSubEventsUrl, data || {});
});

export const getGenerateCustomerCode = ((data, params) => {
    return postApiRequest(generateCustomerCodeUrl, data || {});
});

export const getGenerateEventTypeCode = ((data, params) => {
    return postApiRequest(generateEventTypeCodeUrl, data || {});
});

export const getGenerateVendorCode = ((data, params) => {
    return postApiRequest(generateVendorCodeUrl, data || {});
});

export const getSaveOrUpdateAdminPortal = ((data, params) => {
    return postApiRequest(saveOrUpdateAdminPortalUrl, data || {});
});

export const getAllBookedCaterings = ((data, params) => {
    return postApiRequest(getAllBookedCateringsUrl, data || {});
});

export const searchCateringByKeyword = ((data, params) => {
    return postApiRequest(searchCateringUrl, data || {});
});

export const getGenerateVenueCode = ((data, params) => {
    return postApiRequest(generateVenueCodeUrl, data || {});
});

export const getAllActiveCities = ((data, params) => {
    return postApiRequest(getAllActiveCityUrl, data || {});
});

export const getLoggedOut = ((data, params) => {
    return postApiRequest(logoutUrl, data || {});
});

export const getAllListEvent = ((data, params) => {
    return postApiRequest(getAllEventsUrl, data || {});
});

export const getEventReport = ((data, params) => {
    return getApiRequest(eventReportUrl + '/' + data);
});

export const getClientSideEvent = ((data, params) => {
    return getApiRequest(eventClientSideUrl + '/' + data);
});

export const searchBykeyword = ((data, params) => {
    return postApiRequest(searchEventsUrl, data || {});
});

export const searchByStatus = ((data, params) => {
    return postApiRequest(searchByBudgetStatusUrl, data || {});
});

export const getUnreadNotification = ((data, params) => {
    return postApiRequest(unreadUrl, data || {});
});

export const getAllCustomers = ((data, params) => {
    return postApiRequest(getAllActiveCustomersUrl, data || {});
});

export const getAllVendors = ((data, params) => {
    return postApiRequest(getAllVendorsUrl, data || {});
});

export const editEventDetail = ((data, params = {}) => {
    return postApiRequest(saveEventMasterUrl, data || {}, params);
});

export const generateEventCode = ((data, params = {}) => {
    return postApiRequest(generateEventCodeUrl, data || {}, params);
});

export const generateCateringCode = ((data, params = {}) => {
    return postApiRequest(generateCateringCodeUrl, data || {}, params);
});
