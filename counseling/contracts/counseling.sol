// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
contract counseling{
mapping(string=>string) public student;
function addStudent(string memory address_student, string memory md) public {
    student[address_student] = md;
}
}