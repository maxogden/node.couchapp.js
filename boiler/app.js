var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'_design/app'
  , rewrites: 
    [ {from:"/", to:'_show/cors_index', headers: ''}
    , {from:"cache.manifest", to:'_show/cache'}
    , {from:"favicon.png", to:'favicon.ico'}
    , {from:"/api", to:'../../'}    
    , {from:"/api/*", to:'../../*'}
    , {from:"/*", to:'*'}
    ]
  , shows: {
      cache: function(head, req) {
        var manifest = "";
        for (var a in this._attachments) {
          manifest += ("/" + a + "\n");
        }
        var r =
          { "headers": { "Content-Type": "text/cache-manifest"}
          , "body": "CACHE MANIFEST\n" + manifest
          }
        return r;
      },
      cors_index: function(head, req) {
        return { 
          "headers": { 
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400"
          },
          "body": "<!doctype html public>  <html manifest=\"/cache.manifest\">    <head>      <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">      <meta name=\"keywords\" content=\"\" />      <meta name=\"description\" content=\"\" />      <link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"favicon.ico\" />      <link rel=\"shortcut icon\" type=\"image/png\" href=\"favicon.png\" />      <title></title>      <link rel=\"stylesheet\" type=\"text/css\" href=\"layout.css\" />      <script language=\"javascript\" type=\"text/javascript\" src=\"jquery-1.4.4.min.js\"></script>      <script language=\"javascript\" type=\"text/javascript\" src=\"sammy/sammy.js\"></script>      <script language=\"javascript\" type=\"text/javascript\" src=\"site.js\"></script>    </head>    <body>    </body>  </html>"
        }
      }
    }
  }
  ;

ddoc.views = {};

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {   
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {     
    throw "Only admin can delete documents on this database.";
  } 
}

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;