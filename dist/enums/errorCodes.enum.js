"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    // General errors
    ErrorCode["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    // Authentication errors
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    ErrorCode["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    ErrorCode["USER_NOT_VERIFIED"] = "USER_NOT_VERIFIED";
    ErrorCode["INVALID_ADMIN_EMAIL"] = "INVALID_ADMIN_EMAIL";
    ErrorCode["SIGN_IN_WITH_GOOGLE"] = "SIGN_IN_WITH_GOOGLE";
    ErrorCode["SIGN_IN_ERROR"] = "SIGN_IN_ERROR";
    // Validation errors
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["MISSING_REQUIRED_FIELD"] = "MISSING_REQUIRED_FIELD";
    ErrorCode["INVALID_FIELD_VALUE"] = "INVALID_FIELD_VALUE";
    ErrorCode["INCORRECT_PASSWORD"] = "INCORRECT_PASSWORD";
    // Data access errors
    ErrorCode["RESOURCE_NOT_FOUND"] = "RESOURCE_NOT_FOUND";
    ErrorCode["DUPLICATE_RESOURCE"] = "DUPLICATE_RESOURCE";
    ErrorCode["FAILED_SENDING_OTP"] = "FAILED_SENDING_OTP";
    ErrorCode["FAILED_UPDATING"] = "FAILED_UPDATING";
    // Business logic errors
    ErrorCode["EMAIL_ALREADY_EXISTS"] = "EMAIL_ALREADY_EXISTS";
    ErrorCode["USERNAME_ALREADY_EXISTS"] = "USERNAME_ALREADY_EXISTS";
    ErrorCode["INSUFFICIENT_FUNDS"] = "INSUFFICIENT_FUNDS";
    ErrorCode["ORDER_NOT_FOUND"] = "ORDER_NOT_FOUND";
    ErrorCode["INVALID_OPERATION"] = "INVALID_OPERATION";
    ErrorCode["USER_ALREADY_JOINED"] = "USER_ALREADY_JOINED";
    ErrorCode["TRIP_IS_FULL"] = "TRIP_IS_FULL";
    ErrorCode["CONVERSATION_DOESNOT_EXIST"] = "CONVERSATION_DOESNOT_EXIST";
    // Custom application-specific errors
    ErrorCode["CUSTOM_ERROR_1"] = "CUSTOM_ERROR_1";
    ErrorCode["CUSTOM_ERROR_2"] = "CUSTOM_ERROR_2";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
// enum ErrorCode {
//     // General errors
//     INTERNAL_SERVER_ERROR = 500,
//     // Authentication errors
//     UNAUTHORIZED = 401,
//     FORBIDDEN = 403,
//     USER_NOT_FOUND = 404,
//     INVALID_CREDENTIALS = 400,
//     // Validation errors
//     VALIDATION_ERROR = 422,
//     MISSING_REQUIRED_FIELD = 422,
//     INVALID_FIELD_VALUE = 422,
//     // Data access errors
//     RESOURCE_NOT_FOUND = 404,
//     DUPLICATE_RESOURCE = 409,
//     // Business logic errors
//     INSUFFICIENT_FUNDS = 403,
//     ORDER_NOT_FOUND = 404,
//     INVALID_OPERATION = 400,
//     // Custom application-specific errors
//     CUSTOM_ERROR_1 = 500,
//     CUSTOM_ERROR_2 = 500,
// }
