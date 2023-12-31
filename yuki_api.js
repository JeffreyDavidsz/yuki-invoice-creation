const { JSDOM } = require("jsdom");
const strWebserviceUrl = "https://api.yukiworks.nl/ws/Sales.asmx";

/**
 * Authenticate with the Yuki API
 * @param {string} API_KEY
 * @returns {string} SessionID
 */
async function Authenticate(API_KEY) {
  // Build SOAP XML message for WebServiceMethod "http://www.theyukicompany.com/Authenticate".
  const strXml = `<?xml version="1.0" encoding="utf-8"?>
  <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
      <Authenticate xmlns="http://www.theyukicompany.com/">
        <accessKey>${API_KEY}</accessKey>
      </Authenticate>
    </soap12:Body>
  </soap12:Envelope>`;

  // Create ServerXMLHTTP object.
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/soap+xml; charset=utf-8",
      SOAPAction: "http://www.theyukicompany.com/Authenticate",
      "Content-Length": strXml.length.toString(),
    },
    body: strXml,
  };

  try {
    // Send SOAP message using the dynamically imported fetch
    const response = await fetch(strWebserviceUrl, options);

    // Print out the request status.
    console.log(
      `WebServiceMethod "Authenticate" request status: ${response.status} ${response.statusText}\n\n`
    );

    // Print out the SOAP XML response.
    const responseText = await response.text();
    console.log(
      `<div style="border: solid 1px black;">${responseText}</div>\n\n`
    );

    // Use jsdom to parse the XML response for the second SOAP request
    const dom = new JSDOM(responseText, { contentType: "text/xml" });
    const xmlDoc = dom.window.document;
    return (strSessionId =
      xmlDoc.querySelector("AuthenticateResult").textContent);
  } catch (error) {
    return error;
  }
}

/**
 * Process sales invoices
 * @param {*} sessionID
 * @param {*} administrationId
 * @param {*} xmlDoc
 * @returns {string} Yuki API response
 */
async function ProcessSalesInvoices(sessionID, administrationId, xmlDoc) {
  try {
    // Build SOAP XML message for WebServiceMethod "http://www.theyukicompany.com/ProcessSalesInvoices".
    const strXml2 = `<?xml version="1.0" encoding="utf-8"?>
  <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
      <ProcessSalesInvoices xmlns="http://www.theyukicompany.com/">
        <sessionId>${sessionID}</sessionId>
        <administrationId>${administrationId}</administrationId>
        <xmlDoc>${xmlDoc}</xmlDoc>
      </ProcessSalesInvoices>
    </soap12:Body>
  </soap12:Envelope>`;

    // Create ServerXMLHTTP object for the second request.
    const options2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/soap+xml; charset=utf-8",
        SOAPAction: "http://www.theyukicompany.com/ProcessSalesInvoices",
        "Content-Length": strXml2.length.toString(),
      },
      body: strXml2,
    };

    // Send the second SOAP message using the dynamically imported fetch
    const response2 = await fetch(strWebserviceUrl, options2);

    // Print out the request status.
    console.log(
      `WebServiceMethod "ProcessSalesInvoices" request status: ${response2.status} ${response2.statusText}\n\n`
    );

    // Print out the SOAP XML response.
    const responseText2 = await response2.text();
    return `<div style="border: solid 1px black;">${responseText2}</div>`;
  } catch (error) {
    return error;
  }
}

module.exports = { Authenticate, ProcessSalesInvoices };
