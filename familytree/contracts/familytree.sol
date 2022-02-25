// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract familytree{

struct family{
    string father;
    string mother;
}
string[] public all_people;

mapping(string=>string) public person_identity;
mapping(string=>string) public person_name;
mapping(string=>family) public connection;
function addPerson(string memory address_person, string memory md, string memory fullname) public {
    person_identity[address_person] = md;
    person_name[address_person] = fullname;
    all_people.push(address_person);
}
function makeConnection(string memory _person, string memory _father,string memory _mother) public{
    family memory _family = family({
        father:_father,
        mother: _mother
        });
    connection[_person]=_family;
}
function getAll() public view returns(string[] memory){
return all_people;
}
}