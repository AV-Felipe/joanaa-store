// CLASSES

class invoice {
    constructor (customer, dueDate, value) {
        this.customer = customer;
        this.dueDate = dueDate;
        this.value = value;
        this.idNumber = Date.now();
        this.issueDate = this.formatDate();
        this.lateFeeRules = lateFeeStandards.regularCustomer;
    }
    formatDate(){
        const today = new Date();

        return(today.toISOString().split('T')[0]);
    }
};

// CONSTANT OBJECTS

const lateFeeStandards = {
    regularCustomer: {
        fine: 0.02,
        interest: 0.001,
        interestType: {calculationMethod: 'simple', basis: 'daily'}
    },
    
};

// MOCK DB

const invoiceDB = [
    {
        customer: 'Felipe',
        dueDate: '1985-07-08',
        value: 100,
        idNumber: 487065600000,
        issueDate: '1985-06-08',
        lateFeeRules: {
            fine: 0.02,
            interest: 0.001,
            interestType: {
                basis: 'daily',
                calculationMethod: 'simple'
            },
        },
    },
];


// ELEMENTS

const inputFieldCustomerName = document.getElementById('customerName');
const inputFieldDueDate = document.getElementById('dueDate');
const inputFieldBaseValue = document.getElementById('baseValue');

const formInputInvoice = document.getElementById('invoiceInputForm');

const buttonAddInvoice = document.getElementById('addInvoice');
const buttonUpdateValue = document.getElementById('updateValues');

const outputInvoiceList = document.getElementById('invoiceList');
outputInvoiceList.innerHTML = generateInvoiceRow(invoiceDB[0]);

// EVENT LISTENERS

buttonAddInvoice.addEventListener('click', saveInvoice);
buttonUpdateValue.addEventListener('click', getCurrentValues);

// FUNCTIONS

// structures data for html node
function generateInvoiceRow (invoice) {
    return(
        `
        <tr class="newInvoice">
            <td class="invoiceNumber">${invoice.idNumber}</td>
            <td class="invoiceIssueDate">${invoice.issueDate}</td>
            <td class="invoiceCustomer">${invoice.customer}</td>
            <td class="invoiceMainValue">${invoice.value.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'})}</td>
            <td class="invoiceDueDate">${invoice.dueDate}</td>
            <td class="invoiceCurrentValue"></td>
            <td class="invoiceLateFee"></td>
        </tr>
        `
    );
};

//check if input fields are filled, add values to mock db and render them on page list
function saveInvoice () {
    if(document.querySelector("#invoiceInputForm-newInvoiceData legend span")){
        document.querySelector("#invoiceInputForm-newInvoiceData legend span").remove();
    }

    //create new element on mockDB
    if(inputFieldCustomerName.value === "" || inputFieldDueDate.value === "" || inputFieldBaseValue.value === ""){
        document.querySelector("#invoiceInputForm-newInvoiceData legend").innerHTML += `<span class="alertMessage"> ! todos os campos devem ser preenchidos ! </span>`;
    }else{
        const newInvoice = new invoice(inputFieldCustomerName.value, inputFieldDueDate.value, Number(inputFieldBaseValue.value));
        console.log(newInvoice);
        invoiceDB.push(newInvoice);
        outputInvoiceList.innerHTML += generateInvoiceRow(invoiceDB[invoiceDB.length - 1]);
        formInputInvoice.reset();
    }
    
}

function getCurrentValues () {
    let indexCounter = 0;
    invoiceDB.map(oneInvoice => {
        const stringDueDate = new Date(`${oneInvoice.dueDate} 00:00:00`); //case we dont pass thee time, with date, we get an timezone difference in our parsed date
        const stringCurrentDate = new Date();
        console.log(stringDueDate);
        console.log(stringCurrentDate);

        if(stringDueDate < stringCurrentDate){
            //get the number of due days
            console.log('atrasado');
            let daysLate = stringCurrentDate.getTime() - stringDueDate.getTime(); //converts the timestamp to unix date value (the result is in miliseconds)
            //console.log(daysLate);
            daysLate = Math.floor(daysLate / (1000 * 3600 * 24)); //converts to days, ignoring hour fractions
            console.log(daysLate);

            if(daysLate > 0){
                const fineValue = oneInvoice.lateFeeRules.fine * oneInvoice.value;
                const interestValue = (oneInvoice.lateFeeRules.interest * oneInvoice.value) * daysLate;
                const currentValue = oneInvoice.value + fineValue + interestValue;
                console.log(currentValue);

                let documentCurrentValueList = document.querySelectorAll('#invoiceList tr .invoiceCurrentValue');
                let documentLateFeeList = document.querySelectorAll('#invoiceList tr .invoiceLateFee');
                documentCurrentValueList[indexCounter].innerHTML = currentValue.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
                documentLateFeeList[indexCounter].innerHTML = (fineValue + interestValue).toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
            }
            
        }else{
            console.log('em dia');
        }

        indexCounter++
    });
};

