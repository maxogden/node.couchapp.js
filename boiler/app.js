var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'_design/app'
  , rewrites: 
    [ {from:"/", to:'index.html'}
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