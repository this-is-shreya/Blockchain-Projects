// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract hireMe{

struct employee{
string name;
string experience;

}
// string[] emails;
mapping(string=>bool) emails;
mapping(string=>employee) public emp;
function strConcat(string memory _a, string memory _b, string memory _c, string memory _d, 
string memory _e) internal pure returns(string memory){
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    bytes memory _bc = bytes(_c);
    bytes memory _bd = bytes(_d);
    bytes memory _be = bytes(_e);
    string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
    bytes memory babcde = bytes(abcde);
    uint k = 0;
    for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
    for (uint i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
    for (uint i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
    for (uint i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
    for (uint i = 0; i < _be.length; i++) babcde[k++] = _be[i];
    return string(babcde);
}

function addEmp(string memory name, string memory exp,string memory email) public {

if(!emails[email]){
emp[email] = employee(name,exp);
emails[email] = true;
}
else{
    string memory new_exp = strConcat(emp[email].experience,", ",exp,"","");
    emp[email] = employee(name,new_exp);

}
}

}