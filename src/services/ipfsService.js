import { create } from "ipfs-http-client";

class IpfsService {
    client = create('https://ipfs.infura.io:5001/api/v0');

    async uploadFile(data)  {
        return await this.client.add(data);
    }

    getFilePath(path) {
        return `https://ipfs.infura.io/ipfs/${path}`
    }
}

const instance = new IpfsService();

export default instance;