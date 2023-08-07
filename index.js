require("dotenv").config(); // load environment variables from .env file
const { Authenticate, ProcessSalesInvoices } = require("./yuki_api");
const strAccessKey = process.env.API_KEY; // API_KEY from .env file
const strAdministrationId = process.env.ADMINISTRATION_ID; // ADMINISTRATION_ID from .env file
const strSalesXml = `
<SalesInvoices xmlns="urn:xmlns:http://www.theyukicompany.com:salesinvoices" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <SalesInvoice>
                <Reference>669EC934-0187</Reference>
                <Subject>Testfactuur - 2</Subject>
                <PaymentMethod>ElectronicTransfer</PaymentMethod>
                <Process>false</Process>
                <EmailToCustomer>false</EmailToCustomer>
                <Layout>VICREO ENGELS</Layout>
                <Date>2023-07-22</Date>
                <DueDate>2023-08-22</DueDate>
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


/**
 * Deliver an invoice to Yuki
 */
async function DeliverInvoice() {
  const sessionId = await Authenticate(strAccessKey); // Get the sessionID
  console.log(
    await ProcessSalesInvoices(sessionId, strAdministrationId, strSalesXml)
  );
}

DeliverInvoice();
