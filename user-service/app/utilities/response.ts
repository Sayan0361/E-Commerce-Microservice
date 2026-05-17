const formatResponse = (
    statusCode: number,
    message: string,
    data?: unknown
) => {
    return {
        statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            success: statusCode < 400,
            message,
            ...(data ? { data } : {})
        }),
    };
};

export const SuccessResponse = (
    data?: unknown,
    message: string = "success"
) => {
    return formatResponse(200, message, data);
};

export const ErrorResponse = (
    statusCode: number,
    message: string,
    data?: unknown
) => {
    return formatResponse(statusCode, message, data);
};