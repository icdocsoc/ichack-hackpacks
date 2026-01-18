# Graph Databases

A graph database stores data as a graph of **nodes connected by relationships**.
Nodes and relationships are **labelled** to describe types of objects and
connections respectively, and key-value mappings called **properties** can be
attached to both.

This HackPack discusses [**Neo4j**](https://neo4j.com/), a graph database
implementation which you can integrate into your project using drivers provided
for a [wide range of programming
languages](https://neo4j.com/docs/bolt/current/neo4j-drivers/).

## Why use a graph database?

Graph databases are optimised for highly interconnected data. The useful
insights from such datasets are often derived from the relationships between
points:

- What's the shortest path from _X_ to _Y_?
- Which points have the most connections?
- Which points are connected to both _X_ and _Y_?

For example, recommendation algorithms are often designed to answer the question
"what do users like you like to see?" This can be written as the following
_Cypher query_:

``` cypher
MATCH (user:USER)-[:LIKES]->(x)<-[:LIKES]-(y)-[:LIKES]->(r)
WHERE user.id = "{your ID here}" AND x <> r
RETURN r
```

The `MATCH` clause instructs Neo4j to:

- find the node labelled `USER` which represents you (via the `id` _property_)
- find posts `x` which you have liked
- find users `y` which have also liked that post
- find posts `r` (distinct from `x`) which user `y` has also liked

## Installation (TODO)

## The Cypher query language

Cypher queries are composed of _clauses_, like the `MATCH` clauses described
above. Making changes to the data often involves selecting parts of the graph to
edit via `MATCH`, then appending a _writing clause_:

- `CREATE` / `MERGE`: insert nodes and relationships. Using `CREATE` will fail
  if nodes or relationships already exist which match the pattern -- use `MERGE`
  to override this behaviour.
- (`DETACH`) `DELETE`: remove nodes and relationships. Using `DELETE` alone will
  fail if a node selected for deletion is still connected to the rest of the
  graph -- use `DETACH DELETE` to override this behaviour.
- `SET`: attach a property to a node or relationship.
- `REMOVE`: remove a property from a node or relationship.

### Example 1: liking a post

``` cypher
MATCH (user:USER), (post:POST)
WHERE user.id = "{your ID here}" AND post.id = "{the ID of a post you liked}"
CREATE (user)-[:LIKES]->(post)
```

This query instructs Neo4j to:

- find the `USER` node that represents you and the `POST` node that represents
  the post you liked
- create a new `LIKES` relationship from you to the post

> [!WARNING]
> The following similar query would not have the same effect:
>
> ``` cypher
> CREATE (user:USER)-[:LIKES]->(post:POST)
> WHERE user.id = "{your ID here}" AND post.id = "{the ID of a post you liked}"
> ```
>
> This is because the entire pattern within the `CREATE` clause is inserted. In
> the best case, the query would fail, stating that the `user` and `post` nodes
> already exist. In the worst case, two new nodes would be created for the
> existing user and post.

### Example 2: deleting all of a user's posts

``` cypher
MATCH (user:USER)-[:POSTED]->(post:POST)
WHERE user.id = "{your ID here}"
DETACH DELETE post
```

This query instructs Neo4j to:

- find the `USER` node that represents you
- find `POST` nodes which are connected to you by the `POSTED` relationship
- delete the posts along with all of their relationships to other nodes in the
  graph
