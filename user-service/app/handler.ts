import { APIGatewayProxyEventV2 } from 'aws-lambda';

export const Health = async (
    event: APIGatewayProxyEventV2
) => {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
            message: "Service is healthy"
        })
    };
};

export const Signup = async (
    event : APIGatewayProxyEventV2
) => {
    console.log(event);

    return {
        statusCode : 200,
        headers : {
            "Access-Control-Allow-Origin" : "*"
        },
        body : JSON.stringify({
            message : "Signup Route",
            data : {}
        })
    };
}