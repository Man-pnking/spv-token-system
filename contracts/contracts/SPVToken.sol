// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SPVToken is ERC20, Ownable {
    address public bondingCurve;
    bool public curveSet;

    event CurveSet(address indexed curve);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    constructor() ERC20("Special Purpose Vehicle", "SPV") Ownable(msg.sender) {}

    function setBondingCurve(address _curve) external onlyOwner {
        require(!curveSet, "Curve already set");
        require(_curve != address(0), "Invalid curve");
        bondingCurve = _curve;
        curveSet = true;
        emit CurveSet(_curve);
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == bondingCurve, "Only bonding curve");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(msg.sender == bondingCurve, "Only bonding curve");
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }
}