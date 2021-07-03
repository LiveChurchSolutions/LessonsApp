import React from "react";
import { ApiHelper, InputBox, ErrorMessages, ActionInterface } from ".";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { ArrayHelper, AssetInterface, ResourceInterface } from "../../helpers";

interface Props {
  action: ActionInterface,
  studyId: string,
  programId: string,
  updatedCallback: (action: ActionInterface, created: boolean) => void
}

export const ActionEdit: React.FC<Props> = (props) => {
  const [action, setAction] = React.useState<ActionInterface>({} as ActionInterface);
  const [errors, setErrors] = React.useState([]);
  const [lessonResources, setLessonResources] = React.useState<ResourceInterface[]>(null);
  const [studyResources, setStudyResources] = React.useState<ResourceInterface[]>(null);
  const [programResources, setProgramResources] = React.useState<ResourceInterface[]>(null);
  const [allAssets, setAllAssets] = React.useState<AssetInterface[]>(null);


  const handleCancel = () => props.updatedCallback(action, false);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let a = { ...action };
    switch (e.currentTarget.name) {
      case "sort": a.sort = parseInt(e.currentTarget.value); break;
      case "actionType":
        a.actionType = e.currentTarget.value;
        break;
      case "content": a.content = e.currentTarget.value; break;
      case "resource":
        a.resourceId = e.currentTarget.value;
        a.assetId = null;
        let select = e.currentTarget as HTMLSelectElement;
        a.content = select.options[select.selectedIndex].text;
        break;
      case "asset":
        a.assetId = e.currentTarget.value;
        if (a.assetId === "") a.assetId = null;
        let resourceSelect = document.getElementById("resourceSelect") as HTMLSelectElement;
        let assetSelect = e.currentTarget as HTMLSelectElement;
        a.content = resourceSelect.options[resourceSelect.selectedIndex].text + " - " + assetSelect.options[assetSelect.selectedIndex].text;
        break;
    }
    setAction(a);
  }

  const checkResourcesLoaded = () => {
    if (action?.actionType === "Play") {
      if (!lessonResources) ApiHelper.get("/resources/content/lesson/" + action.lessonId, "LessonsApi").then((data: any) => { setLessonResources(data); });
      if (!studyResources) ApiHelper.get("/resources/content/study/" + props.studyId, "LessonsApi").then((data: any) => { setStudyResources(data); });
      if (!programResources) ApiHelper.get("/resources/content/program/" + props.programId, "LessonsApi").then((data: any) => { setProgramResources(data); });
    }
  }

  const checkAssetsLoaded = () => {
    if (allAssets === null) {
      if (lessonResources && studyResources && programResources) {
        const allResources = [].concat(lessonResources).concat(studyResources).concat(programResources);
        if (allResources.length > 0) {
          if (!action.resourceId) action.resourceId = allResources[0].id;
          const resourceIds: string[] = ArrayHelper.getUniqueValues(allResources, "id");
          ApiHelper.get("/assets/resourceIds?resourceIds=" + resourceIds.join(","), "LessonsApi").then((data: any) => { setAllAssets(data); })
        }
      }
    }
  }

  const validate = () => {
    let errors = [];
    if (action.content === "") errors.push("Please enter content text.");
    setErrors(errors);
    return errors.length === 0;
  }

  const handleSave = () => {
    if (validate()) {
      const a = action;
      if (!a.actionType) a.actionType = "Say";
      if (a.actionType !== "Play") { a.resourceId = null; a.assetId = null; }

      ApiHelper.post("/actions", [a], "LessonsApi").then(data => {
        setAction(data);
        props.updatedCallback(data[0], !props.action.id);
      });
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this action?")) {
      ApiHelper.delete("/actions/" + action.id.toString(), "LessonsApi").then(() => props.updatedCallback(null, false));
    }
  }

  const getContent = () => {
    if (action.actionType !== "Play") {
      return (<FormGroup>
        <FormLabel>Content</FormLabel>
        <FormControl type="text" name="content" value={action.content} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="" />
      </FormGroup>);
    }
  }


  const getAsset = () => {
    if (allAssets && action?.resourceId) {
      const assets = ArrayHelper.getAll(allAssets, "resourceId", action.resourceId);
      if (assets.length > 0) {
        const assetItems: JSX.Element[] = []
        assets.forEach((a: AssetInterface) => assetItems.push(<option value={a.id}>{a.name}</option>))

        return (<>
          <FormGroup>
            <FormLabel>Asset</FormLabel>
            <FormControl as="select" name="asset" value={action.assetId} onChange={handleChange}>
              <option value="">All</option>
              {assetItems}
            </FormControl>
          </FormGroup>
        </>);
      }
    }

  }

  const getResource = () => {
    if (action.actionType === "Play") {
      if (lessonResources && studyResources && programResources) {
        return (<>
          <FormGroup>
            <FormLabel>Resource</FormLabel>
            <FormControl as="select" name="resource" id="resourceSelect" value={action.resourceId} onChange={handleChange}>
              {getResourceGroup("Lesson", lessonResources)}
              {getResourceGroup("Study", studyResources)}
              {getResourceGroup("Program", programResources)}
            </FormControl>
          </FormGroup>
          {getAsset()}
        </>);
      }
    }
  }


  const getResourceGroup = (groupName: string, resources: ResourceInterface[]) => {
    if (resources.length > 0) {
      const items: JSX.Element[] = [];
      resources.forEach(r => { items.push(<option value={r.id}>{r.name}</option>) })
      return <optgroup label={groupName}>{items}</optgroup>
    }
  }


  React.useEffect(() => { setAction(props.action) }, [props.action]);
  React.useEffect(checkResourcesLoaded, [action]);
  React.useEffect(checkAssetsLoaded, [lessonResources, studyResources, programResources]);


  return (<>
    <InputBox id="actionDetailsBox" headerText={(action?.id) ? "Edit Action" : "Create Action"} headerIcon="fas fa-check" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />
      <FormGroup>
        <FormLabel>Order</FormLabel>
        <FormControl type="number" name="sort" value={action.sort} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="1" />
      </FormGroup>
      <FormGroup>
        <FormLabel>Action Type</FormLabel>
        <FormControl as="select" name="actionType" value={action.actionType} onChange={handleChange}>
          <option value="Say">Say</option>
          <option value="Do">Do</option>
          <option value="Play">Play</option>
        </FormControl>
      </FormGroup>
      {getContent()}
      {getResource()}
    </InputBox>
  </>);
}