import client from "../../client";

export default {
    Query: {
        seeProfile: (_, {userName}, context, info) => client.user.findUnique({
            where: {
                userName,
            }
        })
    }
}