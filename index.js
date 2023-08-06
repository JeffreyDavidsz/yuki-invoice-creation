require("dotenv").config(); // load environment variables from .env file
const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const strAccessKey = process.env.API_KEY;
const strAdministrationId = process.env.ADMINISTRATION_ID;
const strWebserviceUrl = "https://api.yukiworks.nl/ws/Sales.asmx";
const strSalesXml = `
<SalesInvoices xmlns="urn:xmlns:http://www.theyukicompany.com:salesinvoices" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <SalesInvoice>
                <Subject>Testfactuur - 1</Subject>
                <PaymentMethod>ElectronicTransfer</PaymentMethod>
                <Process>false</Process>
                <EmailToCustomer>false</EmailToCustomer>
                <Layout>VICREO ENGELS</Layout>
                <Date>2023-06-22</Date>
                <DueDate>2023-07-22</DueDate>
                <PriceList />
                <Currency />
                <Remarks>Stripe</Remarks>
                <Contact>
                        <ContactCode>1122</ContactCode>
                        <FullName>Apple Sales International</FullName>
                        <FirstName />
                        <MiddleName />
                        <LastName />
                        <Gender>Male</Gender>
                        <CountryCode>NL</CountryCode>
                        <City>Rotterdam</City>
                        <Zipcode>1234 AA</Zipcode>
                        <AddressLine_1>Bergweg 25</AddressLine_1>
                        <AddressLine_2 />
                        <EmailAddress>info@test.nl</EmailAddress>
                        <Website />
                        <CoCNumber />
                        <VATNumber />
                        <ContactType>Person</ContactType>
                </Contact>
                <InvoiceLines>
                        <InvoiceLine>
                                <Description>Regel 1</Description>
                                <ProductQuantity>2</ProductQuantity>
                                <Product>
                                        <Description>Product 1</Description>
                                        <Reference>TP-1122</Reference>
                                        <Category xsi:nil="true" />
                                        <SalesPrice>14.88</SalesPrice>
                                        <VATPercentage>21.00</VATPercentage>
                                        <VATIncluded>true</VATIncluded>
                                        <VATType>1</VATType>
                                        <GLAccountCode></GLAccountCode>
                                        <Remarks />
                                </Product>
                        </InvoiceLine>
                </InvoiceLines>
        </SalesInvoice>
</SalesInvoices>
`;


// Create an async function to perform the dynamic import
async function performFetch() {
  
    // Build SOAP XML message for WebServiceMethod "http://www.theyukicompany.com/Authenticate".
    const strXml = `<?xml version="1.0" encoding="utf-8"?>
  <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
      <Authenticate xmlns="http://www.theyukicompany.com/">
        <accessKey>${strAccessKey}</accessKey>
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
      console.log(`<div style="border: solid 1px black;">${responseText}</div>\n\n`);
  
 // Use jsdom to parse the XML response for the second SOAP request
 const dom = new JSDOM(responseText, { contentType: "text/xml" });
 const xmlDoc = dom.window.document;
 const strSessionId = xmlDoc.querySelector("AuthenticateResult").textContent;
  
      // Build SOAP XML message for WebServiceMethod "http://www.theyukicompany.com/ProcessSalesInvoices".
      const strXml2 = `<?xml version="1.0" encoding="utf-8"?>
  <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
      <ProcessSalesInvoices xmlns="http://www.theyukicompany.com/">
        <sessionId>${strSessionId}</sessionId>
        <administrationId>${strAdministrationId}</administrationId>
        <xmlDoc>${strSalesXml}</xmlDoc>
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
      console.log(`<div style="border: solid 1px black;">${responseText2}</div>`);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  // Call the function to start the dynamic import and execute the SOAP requests
  performFetch();


