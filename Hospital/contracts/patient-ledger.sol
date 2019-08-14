pragma solidity ^0.4.25;
// Resources
// Heb de volgende blog gebruikt voor het CRUD patroon in Solidity! 
// https://medium.com/robhitchens/solidity-crud-part-1-824ffa69509a
// https://ethereum.stackexchange.com/questions/3609/returning-a-struct-and-reading-via-web3/3614#3614

contract Hospital {
    
    // Director is degene die het patiëntenledger van het ziekenhuis aanmaakt
    // En verplegers de nodige rechten kan geven om dossiers te bekijken/bewerken
    address public director;
    
    // Via volgende mapping kunnen we efficient het dossier van een patient opvragen en hoeven
    // we hier niet over te loopen. Array zou te veel gas kosten, want lineaire search time. 
    mapping(address => Patient) private patientStructs;
    
    // Een array met de addressen van de patiënten. Zo weten enerzijds hoeveel patienten er zijn en wat de keys zijn. 
    address[] private patientIds;
    // Het moet voor iedereen transparant zijn welke verplegers er zijn
    address[] public nursesAccounts; 
    mapping(address => bool) nursesMap;  //Voor te bepalen of iemand een verpleger is gebruiken  we een map. In een ziekenhuis kunnen veel verpelgers werken!
 
    constructor() public  {
        director = msg.sender; 
        nursesMap[msg.sender] = true;  // We veronderstellen dat een directeur ook een verpleger is.

    }
    
    //Iedereen kan een patiëntdossier openen, zelfs de directeur en de verplegers.
    //Echter kunnen patiënten enkel hun algemene info invullen. Geen medische gegevens toevoegen.  
    function insertPatient(string firstName, string lastName, string foodPreference, uint birthDate) public returns (bool success) {
        address patientAddress  = msg.sender; 
        require(patientIds.length == 0 || patientIds[patientStructs[patientAddress].id] != patientAddress); //Patient mag nog niet bestaan! 
        patientStructs[patientAddress].firstName = firstName; 
        patientStructs[patientAddress].lastName = lastName; 
        patientStructs[patientAddress].foodPreference = foodPreference;
        patientStructs[patientAddress].birthDate = birthDate;
        patientStructs[patientAddress].id = patientIds.push(msg.sender) - 1; //push geeft de lengte van de array terug. En we willen de index achterhalen waar in de array het address wordt opgeslagen. 
        return true; //success
    }
    
    //Geeft enkel de basic info terug van de patiënt
    function getPatient(address patientAddress) public view returns (string firstName, string lastName, string foodPreference, uint birthDate, uint id) {
        require(patientIds[patientStructs[patientAddress].id] == patientAddress);
        return (patientStructs[patientAddress].firstName, patientStructs[patientAddress].lastName, patientStructs[patientAddress].foodPreference, patientStructs[patientAddress].birthDate, patientStructs[patientAddress].id);
    }
    
    //Enkel de patiënt zelf kan zijn algemene gegevens
    function updatePatient(string firstName, string lastName, string foodPreference, uint birthDate) restrictedToPatient public returns (uint) {
        address patientAddress  = msg.sender; 
        patientStructs[patientAddress].firstName = firstName; 
        patientStructs[patientAddress].lastName = lastName; 
        patientStructs[patientAddress].foodPreference = foodPreference;
        patientStructs[patientAddress].birthDate = birthDate;
        patientStructs[patientAddress].id = patientIds.push(msg.sender) - 1; //push geeft de lengte van de array terug. En we willen de index achterhalen waar in de array het address wordt opgeslagen. 
        emit PatientEvent(patientStructs[patientAddress].id, patientStructs[patientAddress].firstName, patientStructs[patientAddress].lastName,  patientStructs[patientAddress].foodPreference,  patientStructs[patientAddress].birthDate);
        return patientStructs[patientAddress].id; //success
    }
    
    //Bij ziekenhuisopname moet neergeschreven worden waarom en wanneer de patient wordt opgenomen en wanneer deze vermoedelijk naar huis mag!
    function insertHospitalization(address patientAddress, uint admissionDate, string reason, uint plannedResignation) restrictedToNurse public returns (uint) {
        require(patientIds[patientStructs[patientAddress].id] == patientAddress);
        patientStructs[patientAddress].hospitalizationInfo.admissionDate = admissionDate; 
        patientStructs[patientAddress].hospitalizationInfo.reason = reason; 
        patientStructs[patientAddress].hospitalizationInfo.plannedResignation = plannedResignation; 
        emit HospitalizationInfoEvent(patientStructs[patientAddress].id, patientStructs[patientAddress].hospitalizationInfo.admissionDate, patientStructs[patientAddress].hospitalizationInfo.reason, patientStructs[patientAddress].hospitalizationInfo.plannedResignation);
        return patientStructs[patientAddress].id;
    }
    
    //Bij ziekenhuisopname moet neergeschreven worden waarom en wanneer de patient wordt opgenomen en wanneer deze vermoedelijk naar huis mag!
    function insertTreatment(address patientAddress, string typeOfTreatment, string description, uint date, string status) restrictedToNurse public returns (uint) {
        require(patientIds[patientStructs[patientAddress].id] == patientAddress);
        uint id = ++patientStructs[patientAddress].treatmentCount; 
        patientStructs[patientAddress].treatmentStructs[id].id = id;
        patientStructs[patientAddress].treatmentStructs[id].typeOfTreatment = typeOfTreatment;
        patientStructs[patientAddress].treatmentStructs[id].description = description;
        patientStructs[patientAddress].treatmentStructs[id].date= date;
        patientStructs[patientAddress].treatmentStructs[id].status = status;
        emit TreatmentEvent(patientStructs[patientAddress].id, patientStructs[patientAddress].treatmentStructs[id].id, patientStructs[patientAddress].treatmentStructs[id].typeOfTreatment, patientStructs[patientAddress].treatmentStructs[id].description, patientStructs[patientAddress].treatmentStructs[id].date, patientStructs[patientAddress].treatmentStructs[id].status);
        return id;
    }
    
    
    function getTreatment(address patientAddress, uint treatmentId) restrictedToNurse public view returns (uint id, string typeOfTreatment, string description, uint date, string status) {
        require(patientIds[patientStructs[patientAddress].id] == patientAddress);
        require(treatmentId != 0 &&  patientStructs[patientAddress].id == treatmentId);
        return  (patientStructs[patientAddress].treatmentStructs[id].id, patientStructs[patientAddress].treatmentStructs[id].typeOfTreatment, patientStructs[patientAddress].treatmentStructs[id].description, patientStructs[patientAddress].treatmentStructs[id].date, patientStructs[patientAddress].treatmentStructs[id].status);
    }
    
    //Bij ziekenhuisopname moet de behandeling kunnen aangepast worden.
    function updateTreatment(address patientAddress, uint treatmentId, string typeOfTreatment, string description, uint date, string status) restrictedToNurse public returns (bool success) {
        require(patientIds[patientStructs[patientAddress].id] == patientAddress);
        require(treatmentId !=0 && patientStructs[patientAddress].id == treatmentId);
        uint id = patientStructs[patientAddress].treatmentCount++; 
        patientStructs[patientAddress].treatmentStructs[id].id = id;
        patientStructs[patientAddress].treatmentStructs[id].typeOfTreatment = typeOfTreatment;
        patientStructs[patientAddress].treatmentStructs[id].description = description;
        patientStructs[patientAddress].treatmentStructs[id].date= date;
        patientStructs[patientAddress].treatmentStructs[id].status = status;
        
        emit TreatmentEvent(patientStructs[patientAddress].id, patientStructs[patientAddress].treatmentStructs[id].id, patientStructs[patientAddress].treatmentStructs[id].typeOfTreatment, patientStructs[patientAddress].treatmentStructs[id].description, patientStructs[patientAddress].treatmentStructs[id].date, patientStructs[patientAddress].treatmentStructs[id].status);
        return true;
    }

    // Nodig om in de UI te kunnen lopen
    function getPatientCount() public constant returns (uint count) {
        return patientIds.length; 
    }
    
        // Nodig om in de UI te kunnen lopen
    function getTreatmentCount(address patientAddress) public constant returns (uint count) {
        require(patientIds[patientStructs[patientAddress].id] == patientAddress);
        return patientStructs[patientAddress].treatmentCount; 
    }
    
    function insertNurse(address nurse)  public restrictedToDirector {
        require(!nursesMap[nurse]); // Controleren of the nurse al niet is toegevoegd! 
        nursesMap[nurse] = true; 
        nursesAccounts.push(nurse);
    }

    modifier restrictedToDirector() {
        require(msg.sender == director);
        _;
    }
    
    modifier restrictedToPatient() {
        require(patientIds[patientStructs[msg.sender].id] == msg.sender);
        _;
    }
    
    modifier restrictedToNurse() {
        require(msg.sender == director);
        _;
    }
    
    modifier restrictedToPersonOfInterest() {
        require(msg.sender == director || patientIds[patientStructs[msg.sender].id] == msg.sender || nursesMap[msg.sender]);
        _;
    }
    
    // Events
    event PatientEvent(uint id, string firstName, string lastName, string foodPreference, uint birthDate);
    event TreatmentEvent(uint patientId, uint treatmentId, string typeOfTreatment, string description, uint date, string status);
    event HospitalizationInfoEvent(uint patientId, uint admissionDate, string reason, uint plannedResignation);
    
    // Structs 
    struct Patient {
        //bool isPatient; //Nodig om te zien of een struct bestaat. 
        uint id; //Nodig voor referentiële integriteit. Hierdoor is isPatient eigenlijk overbodig geworden. Deze aanpak laat deletes toe.
        string firstName; 
        string lastName;
        string foodPreference;
        uint birthDate;
        HospitalizationInfo hospitalizationInfo;
        uint treatmentCount;
        mapping(uint => Treatment) treatmentStructs;
    }
    
    struct HospitalizationInfo {
        uint admissionDate;
        string reason; 
        uint plannedResignation;
    }
    
    struct Treatment {
        uint id;
        string typeOfTreatment;
        string description;
        uint date;
        string status;
    }
}

