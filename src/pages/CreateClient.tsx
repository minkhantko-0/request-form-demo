import NewRequest from "./NewRequest";

export default function CreateClient() {
  return (
    <NewRequest
      fixedFormId={6}
      homePath="/console/clients"
      successPath="/console/clients"
      newRequestPath="/console/create-client"
    />
  );
}
