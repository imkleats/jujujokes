const neo4j = require('neo4j-driver');

var neo_uri = process.env.GRAPHENEDB_BOLT_URL
var neo_user = process.env.GRAPHENEDB_BOLT_USER
var neo_pw = process.env.GRAPHENEDB_BOLT_PASSWORD

var driver = neo4j.driver(neo_uri, neo4j.auth.basic(neo_user, neo_pw));

exports.handler = async (event, context) => {
  console.log('protected function!')
  // Reading the context.clientContext will give us the current user
  //const claims = context.clientContext && context.clientContext.user
  //console.log('user claims', claims)
  const neo4jSession = driver.session()

  const query = `
    MATCH (joke:Joke)
    WITH joke, rand() as r
    ORDER by r LIMIT 1
    RETURN joke
  `
  try {
    const result = await neo4jSession.run(query, {offset: numJokes})
      .then(result => {
      console.log(result.records[0].get('joke').properties);
      return result.records[0].get('joke').properties;
      });

    return {
      statusCode: 200,
      body: JSON.stringify({data: result})
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message })
    };
  }
}
