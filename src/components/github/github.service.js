/**
 * Created by JeanLucas on 11/03/2015.
 */
'use strict';
/*jshint esnext: true */

class GH {
  constructor () {
    var github = new Github({
      token: sessionStorage['token'],
      auth: "oauth"
    });
    return github;
  }
}

export default GH;
