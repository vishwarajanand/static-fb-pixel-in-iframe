(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.facebookStaticPixelWrapper = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.fireFacebookPixelEvent = fireFacebookPixelEvent;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  /**
   * Copyright (c) 2016-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the code directory.
   */

  // This will transform an array like
  //   [['key1', 'value1'], ['key2', 'value2']]
  // into string like
  //   key1=value1&key2=value2
  function qsEncode(array) {
    var output = [];
    for (var i = 0, len = array.length; i < len; i++) {
      // does not encode key, expects it to be clean or already encoded
      output.push(array[i][0] + '=' + encodeURIComponent(array[i][1]));
    }
    return output.join('&');
  }

  function fireFacebookPixelEvent(pixelId, eventName, params) {
    var FB_ENDPOINT = 'https://www.facebook.com/tr/';
    var currentUrl = location.href;
    var referrerUrl = document.referrer;
    var inIframe = window.top !== window;

    var tuples = [];
    tuples.push(['id', pixelId]);
    tuples.push(['ev', eventName]);
    tuples.push(['dl', currentUrl]);
    tuples.push(['rl', referrerUrl]);
    tuples.push(['if', inIframe]);
    // add timestamp; fixes issue where if two identical events are fired (the
    // second starts before the first finishes), the browser will send only the
    // first request and give the result to both
    tuples.push(['ts', new Date().valueOf()]);
    if (params && (typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {
      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          var value = params[key];
          var type = value === null ? 'null' : typeof value === 'undefined' ? 'undefined' : _typeof(value);
          if (type in { number: 1, string: 1, boolean: 1 }) {
            // here we encode key because it could contain [ or ]
            // the value will be encoded in qsEncode
            tuples.push(['cd[' + encodeURIComponent(key) + ']', value]);
          } else if (type === 'object') {
            value = typeof JSON === 'undefined' ? String(value) : JSON.stringify(value);
            tuples.push(['cd[' + encodeURIComponent(key) + ']', value]);
          }
        }
      }
    }

    var queryString = qsEncode(tuples);
    var image = new Image();
    image.src = FB_ENDPOINT + '?' + queryString;
  }
});
