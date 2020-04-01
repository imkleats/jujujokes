const { AuthenticationError } = require('apollo-server-lambda');

module.exports = resolvers = {
    Query: {
        getRandomJoke: async (parent, args, context, resolveInfo) => {
            const randomJoke = await context.models.Joke.randomJoke()
            return randomJoke;
        },
        getOneJoke: async (parent, args, context, resolveInfo) => {
            const joke = await context.models.Joke.findOne({_id: args.id});
            return joke;
        },
        getListJoke: async (parent, args, context, resolveInfo) => {
            let sortParams = {};
            let filterParams = {};
            const pageParams = {
                page: args.params.pagination ? (args.params.pagination.page ? args.params.pagination.page : 1) : 1,
                perPage: args.params.pagination ? (args.params.pagination.perPage ? args.params.pagination.perPage : 25) : 25
            };
            if (args.params.sort && args.params.sort.field) {
                sortParams[args.params.sort.field] = args.params.sort.order ? (args.params.sort.order == 'ASC' ? 1 : -1) : 1
            }
            if (args.params.filter) {
                //console.log(args.params.filter);
                filterParams = args.params.filter;
            }

            const jokeList = await context.models.Joke
                                    .find(filterParams)
                                    .sort(sortParams)
                                    .skip((pageParams.page - 1)*pageParams.perPage)
                                    .limit(pageParams.perPage);
            return jokeList;
        },
        getManyJoke: async (parent, args, context, resolveInfo) => {
            //console.log(args.ids);
            const jokes = await context.models.Joke.find({
                _id: {
                    $in: args.ids
                }
            });
            return jokes;
        },
        getJokeCount: async (parent, args, context, resolveInfo) => {
            const count = await context.models.Joke.estimatedDocumentCount();
            return count;
        }
    },
    Mutation: {
        authTest: async (parent, args, context, resolveInfo) => {
            /* if (context.user.role == 'GUEST' || context.user.role == 'ANON_GUEST') {
                return "Uh uh uh, you didn't say the magic word.";
            } */
            if (context.user.role == 'Admin') {
                try {

                } catch (e) {
                    throw Error(e.message);
                }
                return "Please, god damn it.";
            } else {
                throw new AuthenticationError('Not authorized to perform this function.');
            }

            return "This shouldn't ever happen";
        },
        createJoke: async (parent, args, context, resolveInfo) => {
            if (context.user.role == 'Admin') {
                try {
                    const newJoke = await context.models.Joke.create({setup: args.joke.setup, punchline: args.joke.punchline});
                    return newJoke;
                } catch (e) {
                    throw Error(e.message);
                }
            } else {
                throw new AuthenticationError('Not authorized to perform this function.');
            }
        },
        updateJoke: async (parent, args, context, resolveInfo) => {
            //console.log(context.user.role);
            if (context.user.role == 'Admin') {
                try {
                    if (!args.id) {
                        throw Error('updateJoke requires ID of joke.')
                    }
                    const updatedJoke = await context.models.Joke.findByIdAndUpdate(args.id, args.joke, {new: true});
                    return updatedJoke;
                } catch (e) {
                    throw Error(e.message);
                }
            } else {
                throw new AuthenticationError('Not authorized to perform this function.');
            }
        },
        updateManyJoke: async (parent, args, context, resolveInfo) => {
            if (context.user.role == 'Admin') {
                try {
                    const updatedJokes = await context.models.Joke.updateMany({
                        _id: {
                            $in: args.ids
                        }
                    }, args.updates);
                } catch (e) {
                    throw Error(e.message);
                }
                return args.ids;
            } else {
                throw new AuthenticationError('Not authorized to perform this function.');
            }
        },
        deleteJoke: async (parent, args, context, resolveInfo) => {
            if (context.user.role == 'Admin') {
                try {
                    if (!args.id) {
                        throw Error('updateJoke requires ID of joke.')
                    }
                    const deletedJoke = await context.models.Joke.findByIdAndDelete(args.id);
                    return deletedJoke;
                } catch (e) {
                    throw Error(e.message);
                }
            } else {
                throw new AuthenticationError('Not authorized to perform this function.');
            }
        },
        deleteManyJoke: async (parent, args, context, resolveInfo) => {
            if (context.user.role == 'Admin') {
                try {
                    const deletedJokeIds = await context.models.Joke.deleteMany({
                        _id: {
                            $in: args.ids
                        }
                    });
                    return args.ids;
                } catch (e) {
                    throw Error(e.message);
                }
            } else {
                throw new AuthenticationError('Not authorized to perform this function.');
            }
        },
        login: async (parent, args, context, resolveInfo) => {
            try {
                [user, token] = await context.models.User.authenticate(args.email, args.password);
                return {token, user: {
                    id: user.user_id,
                    username: user.user_name,
                    role: user.role,
                }};
            } catch (e) {
                throw Error(e)
            }
        }
    }
}
