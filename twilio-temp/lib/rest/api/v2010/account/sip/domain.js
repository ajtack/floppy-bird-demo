'use strict';

var _ = require('lodash');
var Q = require('q');
var CredentialListMappingList = require(
    './domain/credentialListMapping').CredentialListMappingList;
var IpAccessControlListMappingList = require(
    './domain/ipAccessControlListMapping').IpAccessControlListMappingList;
var Page = require('../../../../../base/Page');
var deserialize = require('../../../../../base/deserialize');
var values = require('../../../../../base/values');

var DomainPage;
var DomainList;
var DomainInstance;
var DomainContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.SipContext.DomainPage
 * @augments Page
 * @description Initialize the DomainPage
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {string} accountSid -
 *          A 34 character string that uniquely identifies this resource.
 *
 * @returns DomainPage
 */
/* jshint ignore:end */
function DomainPage(version, response, accountSid) {
  Page.prototype.constructor.call(this, version, response);

  // Path Solution
  this._solution = {
    accountSid: accountSid
  };
}

_.extend(DomainPage.prototype, Page.prototype);
DomainPage.prototype.constructor = DomainPage;

/* jshint ignore:start */
/**
 * Build an instance of DomainInstance
 *
 * @function getInstance
 * @memberof Twilio.Api.V2010.AccountContext.SipContext.DomainPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns DomainInstance
 */
/* jshint ignore:end */
DomainPage.prototype.getInstance = function getInstance(payload) {
  return new DomainInstance(
    this._version,
    payload,
    this._solution.accountSid
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.SipContext.DomainList
 * @description Initialize the DomainList
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {string} accountSid -
 *          A 34 character string that uniquely identifies this resource.
 */
/* jshint ignore:end */
function DomainList(version, accountSid) {
  /* jshint ignore:start */
  /**
   * @function domains
   * @memberof Twilio.Api.V2010.AccountContext.SipContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Api.V2010.AccountContext.SipContext.DomainContext}
   */
  /* jshint ignore:end */
  function DomainListInstance(sid) {
    return DomainListInstance.get(sid);
  }

  DomainListInstance._version = version;
  // Path Solution
  DomainListInstance._solution = {
    accountSid: accountSid
  };
  DomainListInstance._uri = _.template(
    '/Accounts/<%= accountSid %>/SIP/Domains.json' // jshint ignore:line
  )(DomainListInstance._solution);
  /* jshint ignore:start */
  /**
   * Streams DomainInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.Api.V2010.AccountContext.SipContext.DomainList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         each() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize=50] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no pageSize is defined but a limit is defined,
   *         each() will attempt to read the limit with the most efficient
   *         page size, i.e. min(limit, 1000)
   * @param {Function} [opts.callback] -
   *         Function to process each record. If this and a positional
   * callback are passed, this one will be used
   * @param {Function} [opts.done] -
   *          Function to be called upon completion of streaming
   * @param {Function} [callback] - Function to process each record
   */
  /* jshint ignore:end */
  DomainListInstance.each = function each(opts, callback) {
    opts = opts || {};
    if (_.isFunction(opts)) {
      opts = { callback: opts };
    } else if (_.isFunction(callback) && !_.isFunction(opts.callback)) {
      opts.callback = callback;
    }

    if (_.isUndefined(opts.callback)) {
      throw new Error('Callback function must be provided');
    }

    var done = false;
    var currentPage = 1;
    var limits = this._version.readLimits({
      limit: opts.limit,
      pageSize: opts.pageSize
    });

    function onComplete(error) {
      done = true;
      if (_.isFunction(opts.done)) {
        opts.done(error);
      }
    }

    function fetchNextPage(fn) {
      var promise = fn();
      if (_.isUndefined(promise)) {
        onComplete();
        return;
      }

      promise.then(function(page) {
        _.each(page.instances, function(instance) {
          if (done) {
            return false;
          }

          opts.callback(instance, onComplete);
        });

        if ((limits.pageLimit && limits.pageLimit <= currentPage)) {
          onComplete();
        } else if (!done) {
          currentPage++;
          fetchNextPage(_.bind(page.nextPage, page));
        }
      });

      promise.catch(onComplete);
    }

    fetchNextPage(_.bind(this.page, this, opts));
  };

  /* jshint ignore:start */
  /**
   * @description Lists DomainInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.Api.V2010.AccountContext.SipContext.DomainList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         list() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no page_size is defined but a limit is defined,
   *         list() will attempt to read the limit with the most
   *         efficient page size, i.e. min(limit, 1000)
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  DomainListInstance.list = function list(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};
    var deferred = Q.defer();
    var allResources = [];
    opts.callback = function(resource, done) {
      allResources.push(resource);

      if (!_.isUndefined(opts.limit) && allResources.length === opts.limit) {
        done();
      }
    };

    opts.done = function(error) {
      if (_.isUndefined(error)) {
        deferred.resolve(allResources);
      } else {
        deferred.reject(error);
      }
    };

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    this.each(opts);
    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Retrieve a single page of DomainInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.Api.V2010.AccountContext.SipContext.DomainList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  DomainListInstance.page = function page(opts, callback) {
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'PageToken': opts.pageToken,
      'Page': opts.pageNumber,
      'PageSize': opts.pageSize
    });

    var promise = this._version.page({
      uri: this._uri,
      method: 'GET',
      params: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new DomainPage(
        this._version,
        payload,
        this._solution.accountSid,
        this._solution.sid
      ));
    }.bind(this));

    promise.catch(function(error) {
      deferred.reject(error);
    });

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * create a DomainInstance
   *
   * @function create
   * @memberof Twilio.Api.V2010.AccountContext.SipContext.DomainList
   * @instance
   *
   * @param {object} opts - ...
   * @param {string} opts.domainName -
   *          The unique address on Twilio to route SIP traffic
   * @param {string} [opts.friendlyName] -
   *          A user-specified, human-readable name for the trigger.
   * @param {string} [opts.voiceUrl] - URL Twilio will request when receiving a call
   * @param {string} [opts.voiceMethod] - HTTP method to use with voice_url
   * @param {string} [opts.voiceFallbackUrl] -
   *          URL Twilio will request if an error occurs in executing TwiML
   * @param {string} [opts.voiceFallbackMethod] -
   *          HTTP method used with voice_fallback_url
   * @param {string} [opts.voiceStatusCallbackUrl] -
   *          URL that Twilio will request with status updates
   * @param {string} [opts.voiceStatusCallbackMethod] -
   *          The voice_status_callback_method
   * @param {function} [callback] - Callback to handle processed record
   *
   * @returns {Promise} Resolves to processed DomainInstance
   */
  /* jshint ignore:end */
  DomainListInstance.create = function create(opts, callback) {
    if (_.isUndefined(opts)) {
      throw new Error('Required parameter "opts" missing.');
    }
    if (_.isUndefined(opts.domainName)) {
      throw new Error('Required parameter "opts.domainName" missing.');
    }

    var deferred = Q.defer();
    var data = values.of({
      'DomainName': opts.domainName,
      'FriendlyName': opts.friendlyName,
      'VoiceUrl': opts.voiceUrl,
      'VoiceMethod': opts.voiceMethod,
      'VoiceFallbackUrl': opts.voiceFallbackUrl,
      'VoiceFallbackMethod': opts.voiceFallbackMethod,
      'VoiceStatusCallbackUrl': opts.voiceStatusCallbackUrl,
      'VoiceStatusCallbackMethod': opts.voiceStatusCallbackMethod
    });

    var promise = this._version.create({
      uri: this._uri,
      method: 'POST',
      data: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new DomainInstance(
        this._version,
        payload,
        this._solution.accountSid,
        this._solution.sid
      ));
    }.bind(this));

    promise.catch(function(error) {
      deferred.reject(error);
    });

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Constructs a domain
   *
   * @function get
   * @memberof Twilio.Api.V2010.AccountContext.SipContext.DomainList
   * @instance
   *
   * @param {string} sid - Fetch by unique Domain Sid
   *
   * @returns {Twilio.Api.V2010.AccountContext.SipContext.DomainContext}
   */
  /* jshint ignore:end */
  DomainListInstance.get = function get(sid) {
    return new DomainContext(
      this._version,
      this._solution.accountSid,
      sid
    );
  };

  return DomainListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.SipContext.DomainInstance
 * @description Initialize the DomainContext
 *
 * @property {string} accountSid -
 *          The unique id of the account that sent the message
 * @property {string} apiVersion -
 *          The Twilio API version used to process the message
 * @property {string} authType - The types of authentication mapped to the domain
 * @property {Date} dateCreated - The date this resource was created
 * @property {Date} dateUpdated - The date this resource was last updated
 * @property {string} domainName -
 *          The unique address on Twilio to route SIP traffic
 * @property {string} friendlyName -
 *          A user-specified, human-readable name for the trigger.
 * @property {string} sid - A string that uniquely identifies the SIP Domain
 * @property {string} uri - The URI for this resource
 * @property {string} voiceFallbackMethod -
 *          HTTP method used with voice_fallback_url
 * @property {string} voiceFallbackUrl -
 *          URL Twilio will request if an error occurs in executing TwiML
 * @property {string} voiceMethod - HTTP method to use with voice_url
 * @property {string} voiceStatusCallbackMethod - The voice_status_callback_method
 * @property {string} voiceStatusCallbackUrl -
 *          URL that Twilio will request with status updates
 * @property {string} voiceUrl - URL Twilio will request when receiving a call
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {object} payload - The instance payload
 * @param {sid} accountSid - The account_sid
 * @param {sid} sid - Fetch by unique Domain Sid
 */
/* jshint ignore:end */
function DomainInstance(version, payload, accountSid, sid) {
  this._version = version;

  // Marshaled Properties
  this.accountSid = payload.account_sid; // jshint ignore:line
  this.apiVersion = payload.api_version; // jshint ignore:line
  this.authType = payload.auth_type; // jshint ignore:line
  this.dateCreated = deserialize.rfc2822DateTime(payload.date_created); // jshint ignore:line
  this.dateUpdated = deserialize.rfc2822DateTime(payload.date_updated); // jshint ignore:line
  this.domainName = payload.domain_name; // jshint ignore:line
  this.friendlyName = payload.friendly_name; // jshint ignore:line
  this.sid = payload.sid; // jshint ignore:line
  this.uri = payload.uri; // jshint ignore:line
  this.voiceFallbackMethod = payload.voice_fallback_method; // jshint ignore:line
  this.voiceFallbackUrl = payload.voice_fallback_url; // jshint ignore:line
  this.voiceMethod = payload.voice_method; // jshint ignore:line
  this.voiceStatusCallbackMethod = payload.voice_status_callback_method; // jshint ignore:line
  this.voiceStatusCallbackUrl = payload.voice_status_callback_url; // jshint ignore:line
  this.voiceUrl = payload.voice_url; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    accountSid: accountSid,
    sid: sid || this.sid,
  };
}

Object.defineProperty(DomainInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new DomainContext(
        this._version,
        this._solution.accountSid,
        this._solution.sid
      );
    }

    return this._context;
  },
});

/* jshint ignore:start */
/**
 * fetch a DomainInstance
 *
 * @function fetch
 * @memberof Twilio.Api.V2010.AccountContext.SipContext.DomainInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed DomainInstance
 */
/* jshint ignore:end */
DomainInstance.prototype.fetch = function fetch(callback) {
  return this._proxy.fetch(callback);
};

/* jshint ignore:start */
/**
 * update a DomainInstance
 *
 * @function update
 * @memberof Twilio.Api.V2010.AccountContext.SipContext.DomainInstance
 * @instance
 *
 * @param {object|function} opts - ...
 * @param {string} [opts.apiVersion] - The api_version
 * @param {string} [opts.friendlyName] -
 *          A user-specified, human-readable name for the trigger.
 * @param {string} [opts.voiceFallbackMethod] - The voice_fallback_method
 * @param {string} [opts.voiceFallbackUrl] - The voice_fallback_url
 * @param {string} [opts.voiceMethod] - HTTP method to use with voice_url
 * @param {string} [opts.voiceStatusCallbackMethod] -
 *          The voice_status_callback_method
 * @param {string} [opts.voiceStatusCallbackUrl] - The voice_status_callback_url
 * @param {string} [opts.voiceUrl] - The voice_url
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed DomainInstance
 */
/* jshint ignore:end */
DomainInstance.prototype.update = function update(opts, callback) {
  return this._proxy.update(opts, callback);
};

/* jshint ignore:start */
/**
 * remove a DomainInstance
 *
 * @function remove
 * @memberof Twilio.Api.V2010.AccountContext.SipContext.DomainInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed DomainInstance
 */
/* jshint ignore:end */
DomainInstance.prototype.remove = function remove(callback) {
  return this._proxy.remove(callback);
};

/* jshint ignore:start */
/**
 * Access the ipAccessControlListMappings
 *
 * @function ipAccessControlListMappings
 * @memberof Twilio.Api.V2010.AccountContext.SipContext.DomainInstance
 * @instance
 *
 * @returns {Twilio.Api.V2010.AccountContext.SipContext.DomainContext.IpAccessControlListMappingList}
 */
/* jshint ignore:end */
DomainInstance.prototype.ipAccessControlListMappings = function
    ipAccessControlListMappings() {
  return this._proxy.ipAccessControlListMappings;
};

/* jshint ignore:start */
/**
 * Access the credentialListMappings
 *
 * @function credentialListMappings
 * @memberof Twilio.Api.V2010.AccountContext.SipContext.DomainInstance
 * @instance
 *
 * @returns {Twilio.Api.V2010.AccountContext.SipContext.DomainContext.CredentialListMappingList}
 */
/* jshint ignore:end */
DomainInstance.prototype.credentialListMappings = function
    credentialListMappings() {
  return this._proxy.credentialListMappings;
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.SipContext.DomainContext
 * @description Initialize the DomainContext
 *
 * @property {Twilio.Api.V2010.AccountContext.SipContext.DomainContext.IpAccessControlListMappingList} ipAccessControlListMappings -
 *          ipAccessControlListMappings resource
 * @property {Twilio.Api.V2010.AccountContext.SipContext.DomainContext.CredentialListMappingList} credentialListMappings -
 *          credentialListMappings resource
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {sid} accountSid - The account_sid
 * @param {sid} sid - Fetch by unique Domain Sid
 */
/* jshint ignore:end */
function DomainContext(version, accountSid, sid) {
  this._version = version;

  // Path Solution
  this._solution = {
    accountSid: accountSid,
    sid: sid,
  };
  this._uri = _.template(
    '/Accounts/<%= accountSid %>/SIP/Domains/<%= sid %>.json' // jshint ignore:line
  )(this._solution);

  // Dependents
  this._ipAccessControlListMappings = undefined;
  this._credentialListMappings = undefined;
}

/* jshint ignore:start */
/**
 * fetch a DomainInstance
 *
 * @function fetch
 * @memberof Twilio.Api.V2010.AccountContext.SipContext.DomainContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed DomainInstance
 */
/* jshint ignore:end */
DomainContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new DomainInstance(
      this._version,
      payload,
      this._solution.accountSid,
      this._solution.sid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

/* jshint ignore:start */
/**
 * update a DomainInstance
 *
 * @function update
 * @memberof Twilio.Api.V2010.AccountContext.SipContext.DomainContext
 * @instance
 *
 * @param {object|function} opts - ...
 * @param {string} [opts.apiVersion] - The api_version
 * @param {string} [opts.friendlyName] -
 *          A user-specified, human-readable name for the trigger.
 * @param {string} [opts.voiceFallbackMethod] - The voice_fallback_method
 * @param {string} [opts.voiceFallbackUrl] - The voice_fallback_url
 * @param {string} [opts.voiceMethod] - HTTP method to use with voice_url
 * @param {string} [opts.voiceStatusCallbackMethod] -
 *          The voice_status_callback_method
 * @param {string} [opts.voiceStatusCallbackUrl] - The voice_status_callback_url
 * @param {string} [opts.voiceUrl] - The voice_url
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed DomainInstance
 */
/* jshint ignore:end */
DomainContext.prototype.update = function update(opts, callback) {
  if (_.isFunction(opts)) {
    callback = opts;
    opts = {};
  }
  opts = opts || {};

  var deferred = Q.defer();
  var data = values.of({
    'ApiVersion': opts.apiVersion,
    'FriendlyName': opts.friendlyName,
    'VoiceFallbackMethod': opts.voiceFallbackMethod,
    'VoiceFallbackUrl': opts.voiceFallbackUrl,
    'VoiceMethod': opts.voiceMethod,
    'VoiceStatusCallbackMethod': opts.voiceStatusCallbackMethod,
    'VoiceStatusCallbackUrl': opts.voiceStatusCallbackUrl,
    'VoiceUrl': opts.voiceUrl
  });

  var promise = this._version.update({
    uri: this._uri,
    method: 'POST',
    data: data
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new DomainInstance(
      this._version,
      payload,
      this._solution.accountSid,
      this._solution.sid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

/* jshint ignore:start */
/**
 * remove a DomainInstance
 *
 * @function remove
 * @memberof Twilio.Api.V2010.AccountContext.SipContext.DomainContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed DomainInstance
 */
/* jshint ignore:end */
DomainContext.prototype.remove = function remove(callback) {
  var deferred = Q.defer();
  var promise = this._version.remove({
    uri: this._uri,
    method: 'DELETE'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(payload);
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

Object.defineProperty(DomainContext.prototype,
  'ipAccessControlListMappings', {
  get: function() {
    if (!this._ipAccessControlListMappings) {
      this._ipAccessControlListMappings = new IpAccessControlListMappingList(
        this._version,
        this._solution.accountSid,
        this._solution.sid
      );
    }
    return this._ipAccessControlListMappings;
  },
});

Object.defineProperty(DomainContext.prototype,
  'credentialListMappings', {
  get: function() {
    if (!this._credentialListMappings) {
      this._credentialListMappings = new CredentialListMappingList(
        this._version,
        this._solution.accountSid,
        this._solution.sid
      );
    }
    return this._credentialListMappings;
  },
});

module.exports = {
  DomainPage: DomainPage,
  DomainList: DomainList,
  DomainInstance: DomainInstance,
  DomainContext: DomainContext
};
