public with sharing class AccountTable {
 
    public AccountTable() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccount(){
        try {
            List<Account> accounts = [SELECT Name, RecordType.Name, ASAIDPRS__c, BIL_ID__c,ICE__c,RC__c FROM Account
                                     WHERE RecordType.Name IN ('Business Account', 'Prospect Entreprise', 'Client Entreprise') AND 
                                     ASAIDPRS__c LIKE '219%' AND BIL_ID__c != null];
            return accounts;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}