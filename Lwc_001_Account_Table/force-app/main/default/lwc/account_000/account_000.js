import { LightningElement, track , wire } from 'lwc';
import getAccountList from '@salesforce/apex/AccountTable.getAccount'

export default class Account_000 extends LightningElement {
    @track accountColumns = [
        {label: 'Name', fieldName: 'Name'},
        {label: 'ASAIDPRS', fieldName: 'ASAIDPRS__c'},
        {label: 'Bil ID', fieldName: 'BIL_ID__c'},
        {label: 'ICE', fieldName: 'ICE__c'},
        {label: 'RC', fieldName: 'RC__c'},
        {label: 'RecordType', fieldName: 'RecordType[1]'}
    ];
    @track accountData;
    @track nameFilter = '';
    @track asaidprsFilter = '';
    @track bilIdFilter = '';
    @track rcFilter = '';
    @track iceFilter = '';
    @track recordTypeFilter = '';
    pageSizeOptions = [5, 10, 25, 50, 75, 100]; //Page size options
    totalRecords = 0; //Total no.of records
    pageSize; //No.of records to be displayed per page
    totalPages; //Total no.of pages
    pageNumber = 1; //Page number    
    recordsToDisplay = []; //Records to be displayed on the page
    get bDisableFirst() {
        return this.pageNumber == 1;
    }
    get bDisableLast() {
        return this.pageNumber == this.totalPages;
    }

    @wire (getAccountList) 
    wiredAccounts({data,error}){
        if (data) {
            this.accountData = data;
            console.log(data);
            this.totalRecords = data.length; // update total records count                 
            this.pageSize = this.pageSizeOptions[0]; //set pageSize with default value as first option
            this.paginationHelper(); // call helper menthod to update pagination logic 
        } else if (error) {
        console.log(error);
        }
   }
    handleNameFilterChange(event) {
        this.nameFilter = event.target.value.toLowerCase();
    }
    handleAsaidprsFilterChange(event) {
        this.asaidprsFilter = event.target.value.toLowerCase();

    }

    handleBilIdFilterChange(event) {
        this.bilIdFilter = event.target.value.toLowerCase();
    }

    handleRcFilterChange(event) {
        this.rcFilter = event.target.value.toLowerCase();
    }

    handleIceFilterChange(event) {
        this.iceFilter = event.target.value.toLowerCase();
    }

    handleRecordTypeFilterChange(event) {
        this.recordTypeFilter = event.target.value.toLowerCase();
    }
    get filteredAccounts() {
        let filteredAccounts = this.accountData;

        if (this.nameFilter) {
            filteredAccounts = filteredAccounts.filter(account =>
                account.Name.toLowerCase().includes(this.nameFilter)
            );
        }

        if (this.asaidprsFilter) {
            filteredAccounts = filteredAccounts.filter(account =>
                account.ASAIDPRS__c.toLowerCase().includes(this.asaidprsFilter)
            );
        }

        if (this.bilIdFilter) {
            filteredAccounts = filteredAccounts.filter(account =>
                account.BIL_ID__c.toLowerCase().includes(this.bilIdFilter)
            );
        }

        if (this.rcFilter) {
            filteredAccounts = filteredAccounts.filter(account =>
                account.RC__c.toLowerCase().includes(this.rcFilter)
            );
        }

        if (this.iceFilter) {
            filteredAccounts = filteredAccounts.filter(account =>
                account.ICE__c.toLowerCase().includes(this.iceFilter)
            );
        }

        if (this.recordTypeFilter) {
            filteredAccounts = filteredAccounts.filter(account =>
                account.RecordType.Name.toLowerCase().includes(this.recordTypeFilter)
            );
        }

        return filteredAccounts;
    }

  
    handleRecordsPerPage(event) {
        this.pageSize = event.target.value;
        this.paginationHelper();
    }
    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }
    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }
    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }
    // JS function to handel pagination logic 
    paginationHelper() {
        // calculate total pages
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }
        // set records to display on current page 
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.filteredAccounts.push(this.filteredAccounts[i]);
        }
    }

}