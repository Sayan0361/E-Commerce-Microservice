const formatResponse = (
    statusCode: number,
    message: string,
    data: unknown
) => {
    if (data) {
        return {
            statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message,
                data
            })
        }
    }
    else {
        return {
            statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message
            })
        }
    }
};

export const SuccessResponse = (
    data: object
) => {
    return formatResponse(
        200,
        "success",
        data
    );
};

export const ErrorResponse = (
    code: number = 1000,
    error: unknown
) => {
    if (Array.isArray(error)) {
        const messages = error.map(err => {
            const constraints = err.constraints;
            return constraints ? String(Object.values(constraints)[0]) : "Something went wrong!";
        });

        return formatResponse(
            code, 
            messages[0], 
            messages
        );
    }
    else {
        return formatResponse(
            code,
            `${error}`,
            error
        );
    }
};

/**
 * 
 * 
 * When error is an array of objects
[
    {
        property: "email",
        constraints: {
        isEmail: "email must be a valid email address"
        }
    },
    {
        property: "password",
        constraints: {
        minLength: "password must be at least 6 characters"
        }
    }
]
 */