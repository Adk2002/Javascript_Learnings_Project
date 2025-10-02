// Using async/await
export const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        } catch (err) {
            var Error = next(err);
            console.error(Error);
        }
    };
};
