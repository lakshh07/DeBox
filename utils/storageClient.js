import { Web3Storage } from "web3.storage";

export default function makeStorageClient() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGNBMEQ1QWMyN0JkN2Y0YkNFQzFCRDEzRDQxNzg5QWMzNTliNDg1NWMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mzg0NzMzNTg3NjIsIm5hbWUiOiJEZUJveCJ9.KOhePb7gYrAgO-mNm7EgQKXqsDS7eN8ot4I-pYbHEak";
  return new Web3Storage({ token });
}
