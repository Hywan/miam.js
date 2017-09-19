# Miam • JS

`miam.js` is a parser combinator framework written in TypeScript. It
is highly inspired by the
excellent [nom](https://github.com/Geal/nom/) project. A special focus
is brough on the type system to provide as much safety as possible,
and to avoid consuming too much memory. Thus, the goal of `miam.js` is
to provide a safe and relatively fast framework to build parsers.

`miam.js` is written in [TypeScript](https://www.typescriptlang.org/), a language that compiles into JavaScript.

## Features

  * **Zero-copy**: The parsers do not copy the string being analysed
    despite the fact that they are all pure,
  * **Safe parsing**: We commit to bring as much safety as possible
    regarding the current tooling and languages we have. All means (like
    type system) are used to provide a safe framework to develop new
    parsers,
  * **Speed**: No benchmark yet, but we hope that our approach with
    zero-copy will help to be fast,
  * **Lightweight**: All the type system disappears at compile-time
    (from TypeScript to JavaScript); the resulting files are small
    (≈5Kb).
  
## List of parsers

<table>
  <thead>
    <tr>
      <th>Parser name</th>
      <th>Description</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
   <tr>
     <td><code>tag</code></td>
     <td>consumes a given constant value</td>
     <td>
       <pre><code class="language-js">tag("abc")</code></pre>
     </td>
   </tr>
   <tr>
     <td><code>concat</code></td>
     <td>concatenates two or more parsers together</td>
     <td>
       <pre><code class="language-js">concat(tag("abc"), tag("def"))</code></pre>
     </td>
   </tr>
   <tr>
     <td><code>alt</code></td>
     <td>tests all given parsers until one succeed</td>
     <td>
       <pre><code class="language-js">alt(tag("abc"), tag("def"))</code></pre>
     </td>
   </tr>
   <tr>
     <td><code>opt</code></td>
     <td>tries a parser</td>
     <td>
       <pre><code class="language-js">opt(tag("abc"))</code></pre>
     </td>
   </tr>
   <tr>
     <td><code>regex</code></td>
     <td>consumes a given regular-expression based value</td>
     <td>
       <pre><code class="language-js">regex(/a[bc]/)</code></pre>
     </td>
   </tr>
   <tr>
     <td><code>map</code></td>
     <td>transforms the consumed value from a parser into something else with a function</td>
     <td>
       <pre><code class="language-js">map(
    tag("abc"),
    abc => abc.toUpperCase()
)</code></pre>
     </td>
   </tr>
   <tr>
     <td><code>label_do</code></td>
     <td>gives a name (“label”) to all parser values, and passes them into a function for a final transformation (“do”)</td>
     <td>
       <pre><code class="language-js">label_do(
    {
        first: tag("abc"),
        second: tag("def")
    },
    ({first, second}) => {
        return {
            head: first,
            tail: second
        }
    )
)</code></pre>
     </td>
   </tr>
   <tr>
     <td><code>precede</code></td>
     <td>consumes a prefix and a subject, returns the subject</td>
     <td>
       <pre><code class="language-js">terminate(tag("prefix"), tag("subject"))</code></pre>
     </td>
   </tr>
   <tr>
     <td><code>terminate</code></td>
     <td>consumes a subject and a suffix, returns the subject</td>
     <td>
       <pre><code class="language-js">terminate(tag("subject"), tag("suffix"))</code></pre>
     </td>
   </tr>
  </tbody>
</table>

## Example

See the `examples/` directory for some examples.

The `test/unit/` directory contains a nice overview of the API too.

## Status

Still under development. Please don't use it right now :-).
