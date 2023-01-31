public with sharing class carController {
    //wrapper class
    public class wrapFilter {
        @AuraEnabled
        public String searchKey {get;set;}
        @AuraEnabled
        public Decimal maxPrice {get;set;}
        @AuraEnabled
        public String[] categories {get;set;}
        @AuraEnabled
        public String[] makeType {get;set;}
    }
   
   @AuraEnabled(Cacheable=true)
    public static List<Car__c> getCarList(wrapFilter wrapFilterArg)
    {   
        String key, whereClause ='';
        Decimal maxPrice;
        String[] categories, makeType, criteria = new List<String>{};
        if(wrapFilterArg !=null)
        System.debug(wrapFilterArg);
        {
            maxPrice = wrapFilterArg.maxPrice;
            categories = wrapFilterArg.categories;
            makeType = wrapFilterArg.makeType;
            if(!String.isEmpty(wrapFilterArg.searchKey)){
                key = '%'+wrapFilterArg.searchKey + '%';
                criteria.add('Name LIKE: key');
            }
            if(wrapFilterArg.maxPrice >= 0){
                criteria.add('MSRP__c <= :maxPrice');
            }
            if(wrapFilterArg.categories != null){
                criteria.add('Category__c IN :categories');
            }
            if(wrapFilterArg.makeType != null){
                criteria.add('Make__c IN :makeType');
            }
            if(criteria.size()>0){
                whereClause =  'WHERE ' + String.join(criteria, ' AND ');
            }
        }
      

        String query = 'SELECT Id, Name, MSRP__c, Description__c,Category__c, PictureUrl__c FROM Car__c ' + whereClause + ' WITH SECURITY_ENFORCED' + ' ORDER BY Name';
        return Database.query(query);
    }
    @AuraEnabled(Cacheable=true)
    public static List<Car__c> getSimilarCars(Id CarId, String[] makeType)
    {
        return [SELECT  Id, Name, Category__c, Control__c, Description__c, Fuel_Type__c, make__c, MSRP__c,
         Seats__c, PictureUrl__c FROM Car__c WHERE make__c IN :makeType AND Id != :CarId  ];
    }
}








/*public with sharing class carController {
    // use of wrapper classes

    public class wrapFilter
    {
        @AuraEnabled
        public string searchKey{get;set;}
        @AuraEnabled
        public Decimal maxPrice{get;set;}
        @AuraEnabled
        public string[] categories{get;set;}
        @AuraEnabled
        public String[] make{get;set;}
         
    }

   @AuraEnabled(Cacheable=true)
    public static List<Car__c> getCarList(wrapFilter wrapFilterArg )
    {
        List<string> category,makeType,criteria = new List<String>();
        List<Car__c> x = new List<Car__c>();
       String key = '';
        String whereClause ='';
        Decimal maxPrice;

        if(wrapFilterArg!= null)
        {
            maxPrice =    wrapFilterArg.maxPrice;
            category = wrapFilterArg.categories;
            makeType = wrapFilterArg.make;

        }
        if(!String.isEmpty(wrapFilterArg.searchKey))
        {
            key = '%' + wrapFilterArg.searchKey +'%';
            criteria.add('NAME LIKE key');
        }
        if( wrapFilterArg.maxPrice>=0 )
        {
            criteria.add('MSRP__c<=:maxPrice');
        }
        if(wrapFilterArg.categories!=NULL )
        {
            criteria.add('Category__c IN: category');
        }
        if(wrapFilterArg.make!=NULL )
        {
            criteria.add('make__c IN: make ');
        }
        if(criteria.size()>0)
        {
            whereClause = 'WHERE' + String.join(criteria, 'AND');
        }
        
    string query = 'SELECT Id, Name, Category__c, Control__c, Description__c, Fuel_Type__c, make__c, MSRP__c, Seats__c, PictureUrl__c FROM Car__c'  + whereClause+ 'WITH SECURITY ENFORCED'+
    'ORDER BY NAME';
    //string query = 'SELECT Id, Name, Category__c, Control__c, Description__c, Fuel_Type__c, make__c, MSRP__c, Seats__c, PictureUrl__c FROM Car__c';
    System.debug(query);
    return Database.query(query);

        
   }
    
   
}
*/
