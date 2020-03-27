const neo4j = require('neo4j-driver').v1;
const _ = require('lodash');

const getRandomJoke = async (session) => {
  var numJokes = await session.run('MATCH (j:Joke) RETURN count(j) AS offset')
      .then(results => { 
          if (!_.isEmpty(results.records)) {
              return results.records[0].get('offset').low;
          } else {
              return 0; 
          }
      })

  return session.run(`MATCH (joke:Joke)
                      WITH joke
                      SKIP toInteger(floor(toInteger({offset})*rand())) LIMIT 1
                      RETURN joke`, {offset: numJokes})
      .then(result => {
          console.log(result.records[0].get('joke').properties);
          return result.records[0].get('joke').properties;
      });
};
let cachedDriver;

exports.handler = async (event, context) => {
  var neo_uri = process.env.GRAPHENEDB_BOLT_URL
  var neo_user = process.env.GRAPHENEDB_BOLT_USER
  var neo_pw = process.env.GRAPHENEDB_BOLT_PASSWORD
  
  if (!cachedDriver) {
    cachedDriver = neo4j.driver(neo_uri, neo4j.auth.basic(neo_user, neo_pw))
  }
  //var driver = neo4j.driver(neo_uri, neo4j.auth.basic(neo_user, neo_pw));
  console.log('protected function!')
  console.log(neo_uri)
  console.log(neo_user)
  console.log(neo_pw)
  // Reading the context.clientContext will give us the current user
  //const claims = context.clientContext && context.clientContext.user
  //console.log('user claims', claims)
  const neo4jSession = cachedDriver.session()

  try {
    const result = await getRandomJoke(neo4jSession);
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
