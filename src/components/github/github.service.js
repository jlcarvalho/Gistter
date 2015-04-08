/**
 * Created by JeanLucas on 11/03/2015.
 */
'use strict';
/*jshint esnext: true */

class GH {
  constructor () {}

  getInstance (token) {
    if(!!token){
        var github = new Github({
          token: token,
          auth: "oauth"
        });
        return github;
    } 
  }

  static ghFactory(){
    return new GH();
  }
}

export default GH;
