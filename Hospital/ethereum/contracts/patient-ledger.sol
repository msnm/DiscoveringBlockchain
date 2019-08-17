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
    mapping(uint => address) private patientIdToAddress;
    // Een array met de addressen van de patiënten. Zo weten enerzijds hoeveel patienten er zijn en wat de keys zijn.
    address[] private patientIds;
    // Het moet voor iedereen transparant zijn welke verplegers er zijn
    address[] public nursesAccounts;
    mapping(address => bool) public nursesMap;  //Voor te bepalen of iemand een verpleger is gebruiken  we een map. In een ziekenhuis kunnen veel verpelgers werken!

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
        patientIdToAddress[patientStructs[patientAddress].id] = patientAddress;
        return true; //success
    }

    //Geeft enkel de basic info terug van de patiënt
    function getPatientByAddress(address patientAddress) public view returns (string firstName, string lastName, string foodPreference, uint birthDate, uint id) {
        require(patientIds[patientStructs[patientAddress].id] == patientAddress);
        return (patientStructs[patientAddress].firstName, patientStructs[patientAddress].lastName, patientStructs[patientAddress].foodPreference, patientStructs[patientAddress].birthDate, patientStructs[patientAddress].id);
    }

    //Geeft enkel de basic info terug van de patiënt
    function getPatientById(uint _id) restrictedToNurse public view returns (string firstName, string lastName, string foodPreference, uint birthDate, uint id) {
        require(_id <= patientIds.length -1);
        address patientAddress = patientIds[_id];
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
    function insertHospitalization(uint patientId, uint admissionDate, string reason, uint plannedResignation) restrictedToNurse public returns (uint) {
        require(patientId <= patientIds.length -1);
        address patientAddress = patientIds[patientId];
        patientStructs[patientAddress].hospitalizationInfo.admissionDate = admissionDate;
        patientStructs[patientAddress].hospitalizationInfo.reason = reason;
        patientStructs[patientAddress].hospitalizationInfo.plannedResignation = plannedResignation;
        emit HospitalizationInfoEvent(patientStructs[patientAddress].id, patientStructs[patientAddress].hospitalizationInfo.admissionDate, patientStructs[patientAddress].hospitalizationInfo.reason, patientStructs[patientAddress].hospitalizationInfo.plannedResignation);
        return patientStructs[patientAddress].id;
    }

    //Bij ziekenhuisopname moet neergeschreven worden waarom en wanneer de patient wordt opgenomen en wanneer deze vermoedelijk naar huis mag!
    function updateHospitalization(uint patientId, uint admissionDate, string reason, uint plannedResignation) restrictedToNurse public returns (uint) {
        require(patientId <= patientIds.length -1);
        address patientAddress = patientIds[patientId];

        patientStructs[patientAddress].hospitalizationInfo.admissionDate = admissionDate;
        patientStructs[patientAddress].hospitalizationInfo.reason = reason;
        patientStructs[patientAddress].hospitalizationInfo.plannedResignation = plannedResignation;
        emit HospitalizationInfoEvent(patientStructs[patientAddress].id, patientStructs[patientAddress].hospitalizationInfo.admissionDate, patientStructs[patientAddress].hospitalizationInfo.reason, patientStructs[patientAddress].hospitalizationInfo.plannedResignation);
        return patientStructs[patientAddress].id;
    }

    function getHospitalizationById(uint256 id) restrictedToNurse public view returns (uint patientId, uint admissionDate, string reason, uint plannedResignation) {
        require(id <= patientIds.length -1);
        address patientAddress = patientIds[id];
        return (patientStructs[patientAddress].id, patientStructs[patientAddress].hospitalizationInfo.admissionDate, patientStructs[patientAddress].hospitalizationInfo.reason, patientStructs[patientAddress].hospitalizationInfo.plannedResignation);
    }

    function getHospitalizationByAddress(address patientAddress)  public view returns (uint patientId, uint admissionDate, string reason, uint plannedResignation) {
        return (patientStructs[patientAddress].id, patientStructs[patientAddress].hospitalizationInfo.admissionDate, patientStructs[patientAddress].hospitalizationInfo.reason, patientStructs[patientAddress].hospitalizationInfo.plannedResignation);
    }

    //Bij ziekenhuisopname moet neergeschreven worden waarom en wanneer de patient wordt opgenomen en wanneer deze vermoedelijk naar huis mag!
    function insertTreatment(uint patientId, string typeOfTreatment, string description, uint date, string status) restrictedToNurse public returns (uint) {
        require(patientId <= patientIds.length -1);
        address patientAddress = patientIds[patientId];
        uint id = patientStructs[patientAddress].treatmentCount++;
        patientStructs[patientAddress].treatmentStructs[id].id = id;
        patientStructs[patientAddress].treatmentStructs[id].typeOfTreatment = typeOfTreatment;
        patientStructs[patientAddress].treatmentStructs[id].description = description;
        patientStructs[patientAddress].treatmentStructs[id].date= date;
        patientStructs[patientAddress].treatmentStructs[id].status = status;
        emit TreatmentEvent(patientStructs[patientAddress].id, patientStructs[patientAddress].treatmentStructs[id].id, patientStructs[patientAddress].treatmentStructs[id].typeOfTreatment, patientStructs[patientAddress].treatmentStructs[id].description, patientStructs[patientAddress].treatmentStructs[id].date, patientStructs[patientAddress].treatmentStructs[id].status);
        return id;
    }


    function getTreatmentByAddress(address patientAddress, uint treatmentId)  public view returns (uint id, string typeOfTreatment, string description, uint date, string status) {
        require(patientIds[patientStructs[patientAddress].id] == patientAddress);
        require(patientStructs[patientAddress].treatmentCount >= treatmentId + 1);
        return  (patientStructs[patientAddress].treatmentStructs[treatmentId].id, patientStructs[patientAddress].treatmentStructs[treatmentId].typeOfTreatment, patientStructs[patientAddress].treatmentStructs[treatmentId].description, patientStructs[patientAddress].treatmentStructs[treatmentId].date, patientStructs[patientAddress].treatmentStructs[treatmentId].status);
    }

    function getTreatmentById(uint patientId, uint treatmentId) restrictedToNurse public view returns (uint id, string typeOfTreatment, string description, uint date, string status) {
        require(patientId <= patientIds.length - 1);
        address patientAddress = patientIds[patientId];
        require(patientStructs[patientAddress].treatmentCount >= treatmentId + 1);
        return  (patientStructs[patientAddress].treatmentStructs[treatmentId].id, patientStructs[patientAddress].treatmentStructs[treatmentId].typeOfTreatment, patientStructs[patientAddress].treatmentStructs[treatmentId].description, patientStructs[patientAddress].treatmentStructs[treatmentId].date, patientStructs[patientAddress].treatmentStructs[treatmentId].status);
    }

    //Bij ziekenhuisopname moet de behandeling kunnen aangepast worden.
    function updateTreatment(uint patientId, uint treatmentId, string typeOfTreatment, string description, uint date, string status) restrictedToNurse public returns (bool success) {
        require(patientId <= patientIds.length -1);
        address patientAddress = patientIds[patientId];
        require(patientStructs[patientAddress].treatmentCount >= treatmentId + 1);
        patientStructs[patientAddress].treatmentStructs[treatmentId].typeOfTreatment = typeOfTreatment;
        patientStructs[patientAddress].treatmentStructs[treatmentId].description = description;
        patientStructs[patientAddress].treatmentStructs[treatmentId].date= date;
        patientStructs[patientAddress].treatmentStructs[treatmentId].status = status;

        emit TreatmentEvent(patientStructs[patientAddress].id, patientStructs[patientAddress].treatmentStructs[treatmentId].id, patientStructs[patientAddress].treatmentStructs[treatmentId].typeOfTreatment, patientStructs[patientAddress].treatmentStructs[treatmentId].description, patientStructs[patientAddress].treatmentStructs[treatmentId].date, patientStructs[patientAddress].treatmentStructs[treatmentId].status);
        return true;
    }

    // Nodig om in de UI te kunnen lopen
    function getPatientCount() public constant returns (uint) {
        return patientIds.length;
    }

    // Nodig om in de UI te kunnen lopen
    function getTreatmentCountByAddress(address patientAddress) public constant returns (uint) {
        require(patientIds[patientStructs[patientAddress].id] == patientAddress);
        return patientStructs[patientAddress].treatmentCount;
    }

    function getTreatmentCountById(uint patientId) public constant returns (uint) {
        require(patientId <= patientIds.length -1);
        address patientAddress = patientIds[patientId];
        return patientStructs[patientAddress].treatmentCount;
    }

    function insertNurse(address nurse)  public restrictedToDirector returns (bool success) {
        require(!nursesMap[nurse]); // Controleren of the nurse al niet is toegevoegd! 
        nursesMap[nurse] = true;
        nursesAccounts.push(nurse);
        return true;
    }

    // Nodig om in de UI te kunnen lopen
    function getNursesCount() public constant returns (uint) {
        return nursesAccounts.length;
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
