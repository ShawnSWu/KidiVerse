# Smart Contracts

Self‑executing code stored immutably on the blockchain.

## 1 Hello, Solidity

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract SimpleToken {
    mapping(address => uint256) public balance;

    function mint(uint256 amount) external {
        balance[msg.sender] += amount;
    }

    function transfer(address to, uint256 amount) external {
        require(balance[msg.sender] >= amount, "Insufficient");
        balance[msg.sender] -= amount;
        balance[to] += amount;
    }
}
```

## 2 Common Vulnerabilities

| Vulnerability      | Notorious Example          |
|--------------------|----------------------------|
| **Re‑entrancy**    | The DAO hack (2016)        |
| **Integer overflow / underflow** | BatchOverflow (2018) |
| **Unchecked external call**      | Parity Multisig (2017) |
| **Predictable randomness**       | Fomo3D (2018)          |

### Mitigations

- **OpenZeppelin** audited libraries.  
- Re‑entrancy guard (`nonReentrant`).  
- Solidity ≥0.8’s built‑in overflow checks.  
- Automated analyzers (Slither, Mythril) + manual audits.

## 3 Building a DApp Front‑End

```javascript
import { ethers } from "ethers";

const provider = new ethers.BrowserProvider(window.ethereum);
const signer   = await provider.getSigner();
const token    = new ethers.Contract(addr, abi, signer);

await token.mint(100);
await token.transfer("0xAbc…", 50);
```

- Connect via **MetaMask** or **WalletConnect**.  
- Index on‑chain events with **The Graph** to feed GraphQL queries.

> **Mantra:** *Code is law*—testing and audits cost less than post‑exploit fixes.
