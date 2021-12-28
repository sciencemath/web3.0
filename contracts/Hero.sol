pragma solidity ^0.8.0;

contract Hero {
    enum Class {
        Mage,
        Healer,
        Barbarian
    }

    mapping(address => uint256[]) addressToHeroes;

    function generateRandom() public view virtual returns (uint256) {
        return
            uint256(
                keccak256(abi.encodePacked(block.difficulty, block.timestamp))
            );
    }

    function getHeroes() public view returns (uint256[] memory) {
        return addressToHeroes[msg.sender];
    }

    function getStrength(uint256 hero) public pure returns (uint256) {
        return (hero >> 2) & 0x1F;
    }

    function getHealth(uint256 hero) public pure returns (uint256) {
        return (hero >> 7) & 0x1F;
    }

    function getDex(uint256 hero) public pure returns (uint256) {
        return (hero >> 12) & 0x1F;
    }

    function getIntellect(uint256 hero) public pure returns (uint256) {
        return (hero >> 17) & 0x1F;
    }

    function getMagic(uint256 hero) public pure returns (uint256) {
        return (hero >> 22) & 0x1F;
    }

    function createHero(Class class) public payable {
        require(msg.value >= 0.05 ether, "Please send more money");

        // stats are strength, health, dexerity, intellect, and magic
        uint256[] stats = new uint256[](5);
        stats[0] = 2;
        stats[1] = 7;
        stats[2] = 12;
        stats[3] = 17;
        stats[4] = 22;

        uint256 len = 5;
        uint256 hero = uint256(class);

        do {
            uint256 pos = generateRandom() % len;
            uint256 value = (generateRandom() % (13 + len)) + 1;

            hero |= value << stats[pos];

            len--;
            stats[pos] = stats[len];
        } while (len > 0);

        addressToHeroes[msg.sender].push(hero);
    }
}
