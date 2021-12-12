// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract DeCloud is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _fileCount;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    struct File {
        uint256 fileId;
        string fileHash;
        uint256 fileSize;
        string fileType;
        string fileName;
        string fileDescription;
        uint256 uploadTime;
        address uploader;
    }

    mapping(uint256 => File) private idToFiles;

    event FileUploaded(
        uint256 fileId,
        string fileHash,
        uint256 fileSize,
        string fileType,
        string fileName,
        string fileDescription,
        uint256 uploadTime,
        address uploader
    );

    function uploadFile(
        string memory _fileHash,
        uint256 _fileSize,
        string memory _fileType,
        string memory _fileName,
        string memory _fileDescription
    ) public nonReentrant {
        require(bytes(_fileHash).length > 0, "FileHash not found");
        require(bytes(_fileType).length > 0, "FileType not found");
        require(
            bytes(_fileDescription).length > 0,
            "File Description not found"
        );
        require(bytes(_fileName).length > 0, "FileName not found");
        require(msg.sender != address(0), "Sender Address not found");
        require(_fileSize > 0, "File not found");

        _fileCount.increment();
        uint256 fileCount = _fileCount.current();

        idToFiles[fileCount] = File(
            fileCount,
            _fileHash,
            _fileSize,
            _fileType,
            _fileName,
            _fileDescription,
            block.timestamp,
            msg.sender
        );

        emit FileUploaded(
            fileCount,
            _fileHash,
            _fileSize,
            _fileType,
            _fileName,
            _fileDescription,
            block.timestamp,
            msg.sender
        );
    }

    function fetchUserFiles() external view returns (File[] memory) {
        uint256 totalFileCount = _fileCount.current();
        uint256 userFileCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalFileCount; i++) {
            if (idToFiles[i + 1].uploader == msg.sender) {
                userFileCount += 1;
            }
        }

        File[] memory files = new File[](userFileCount);

        for (uint256 i = 0; i < totalFileCount; i++) {
            if (idToFiles[i + 1].uploader == msg.sender) {
                uint256 currentId = i + 1;
                File storage currentFile = idToFiles[currentId];
                files[currentIndex] = currentFile;
                currentIndex += 1;
            }
        }
        return files;
    }
}
