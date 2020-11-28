/*
  Import the ip-cidr npm package.
  See https://www.npmjs.com/package/ip-cidr
  The ip-cidr package exports a class.
  Assign the class definition to variable IPCIDR.
*/
const IPCIDR = require('ip-cidr');

const path = require('path');

/**
 * Import helper function module located in the same directory
 * as this module. IAP requires the path object's join method
 * to unequivocally locate the file module.
 */
const { getIpv4MappedIpv6Address } = require(path.join(__dirname, 'ipv6.js'));

class IpAddress {
  constructor() {
    // IAP's global log object is used to output errors, warnings, and other
    // information to the console, IAP's log files, or a Syslog server.
    // For more information, consult the Log Class guide on the Itential
    // Developer Hub https://developer.itential.io/ located
    // under Documentation -> Developer Guides -> Log Class Guide
    console.log('Starting the IpAddress product.');
  }
  getFirstIpAddress(cidrStr, callback) {

  // Initialize return arguments for callback
  let firstIpAddress = null;
  let mappedAddress = null;
  let callbackError = null;
  const output = new Object();

  // Instantiate an objec3et from the imported class and assign the instance to variable cidr.
  const cidr = new IPCIDR(cidrStr);
  // Initialize options for the toArray() method.
  // We want an offset of one and a limit of one.
  // This returns an array with a single element, the first host address from the subnet.
  const options = {
    from: 1,
    limit: 1
  };

  // Use the object's isValid() method to verify the passed CIDR.
  if (!cidr.isValid()) {
    // If the passed CIDR is invalid, set an error message.
    callbackError = 'Error: Invalid CIDR passed to getFirstIpAddress.';
  } else {
    // If the passed CIDR is valid, call the object's toArray() method.
    // Notice the destructering assignment syntax to get the value of the first array's element.
    [firstIpAddress] = cidr.toArray(options);
    output['ipv4'] = firstIpAddress;
    // Iterate over sampleIpv4s and pass the element's value to getIpv4MappedIpv6Address().
    // Assign the function results to a variable so we can check if a string or null was returned.
    output['ipv6'] = getIpv4MappedIpv6Address(firstIpAddress);
    if( output['ipv6'] ) {
      console.log(`  IPv4 ${firstIpAddress} mapped to IPv6 Address: ${output["ipv6"]}`);
    } 
    else {
      console.error(`  Problem converting IPv4 ${output["ipv6"]} into a mapped IPv6 address.`);
    }
  }
  // Call the passed callback function.
  // Node.js convention is to pass error data as the first argument to a callback.
  // The IAP convention is to pass returned data as the first argument and error
  // data as the second argument to the callback function.

  return callback(output, callbackError);
  }
}
module.exports = new IpAddress;