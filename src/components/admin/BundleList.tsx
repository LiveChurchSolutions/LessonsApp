import React from "react";
import { ApiHelper, ResourceInterface, AssetInterface, VariantInterface, ArrayHelper, BundleInterface } from "@/utils";
import { DisplayBox, Loading } from "../index";
import { VariantEdit } from "./VariantEdit";
import { ResourceEdit } from "./ResourceEdit";
import { AssetEdit } from "./AssetEdit";
import { Dropdown } from "react-bootstrap";
import { BundleEdit } from "./BundleEdit";

interface Props {
  contentType: string;
  contentId: string;
  contentDisplayName: string;
}

export const BundleList: React.FC<Props> = (props) => {
  const [bundles, setBundles] = React.useState<BundleInterface[]>(null);
  const [resources, setResources] = React.useState<ResourceInterface[]>(null);
  const [assets, setAssets] = React.useState<AssetInterface[]>(null);
  const [variants, setVariants] = React.useState<VariantInterface[]>(null);
  const [editBundle, setEditBundle] = React.useState<BundleInterface>(null);
  const [editResource, setEditResource] = React.useState<ResourceInterface>(null);
  const [editVariant, setEditVariant] = React.useState<VariantInterface>(null);
  const [editAsset, setEditAsset] = React.useState<AssetInterface>(null);

  const clearEdits = () => {
    setEditResource(null);
  };

  const loadData = async () => {
    if (props.contentType && props.contentId) {
      const bundleData: BundleInterface[] = await ApiHelper.get("/bundles/content/" + props.contentType + "/" + props.contentId, "LessonsApi");
      setBundles(bundleData);
      if (bundleData.length === 0) {
        setResources([]);
        setAssets([]);
        setVariants([]);
      } else {
        ApiHelper.get("/resources/content/" + props.contentType + "/" + props.contentId, "LessonsApi")
          .then((data: ResourceInterface[]) => {
            setResources(data);
            if (data.length === 0) {
              setAssets([]);
              setVariants([]);
            } else {
              ApiHelper.get("/assets/content/" + props.contentType + "/" + props.contentId, "LessonsApi")
                .then((data: any) => { setAssets(data); });
              ApiHelper.get("/variants/content/" + props.contentType + "/" + props.contentId, "LessonsApi")
                .then((data: any) => { setVariants(data); });
            }
          });
      }
    }
  };


  const getResources = (bundleId: string) => {
    const result: JSX.Element[] = [];
    if (resources) {

      ArrayHelper.getAll(resources, "bundleId", bundleId).forEach((r) => {
        result.push(
          <tr className="resourceRow" key={`r-${r.id}`}>
            <td>
              <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditResource(r); }} >
                <i className="fas fa-file-alt"></i> {r.name}
              </a>
            </td>
            <td>
              <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdownMenuButton" data-cy="add-button" className="no-caret green" >
                  <i className="fas fa-plus"></i>
                </Dropdown.Toggle>
                {getDropDownMenu(r.id)}
              </Dropdown>
            </td>
          </tr>
        );
        getVariants(r.id).forEach((v: any) => result.push(v));
        getAssets(r.id).forEach((a: any) => result.push(a));
      });

    }
    return result;
  };

  const getVariants = (resourceId: string) => {
    const result: JSX.Element[] = [];
    if (variants) {
      ArrayHelper.getAll(variants, "resourceId", resourceId).forEach((v) => {
        result.push(
          <tr className="variantRow" key={`v-${v.id}`}>
            <td colSpan={2}>
              <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditVariant(v); }} >
                <i className="fas fa-copy"></i> {v.name}
              </a>
            </td>
          </tr>
        );
      });
    }
    return result;
  };

  const getAssets = (resourceId: string) => {
    const result: JSX.Element[] = [];
    if (assets) {
      ArrayHelper.getAll(assets, "resourceId", resourceId).forEach((a) => {
        result.push(
          <tr className="assetRow" key={`a-${a.id}`}>
            <td colSpan={2}>
              <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditAsset(a); }} >
                <i className="fas fa-list-ol"></i> {a.name}
              </a>
            </td>
          </tr>
        );
      });
    }
    return result;
  };

  const getRows = () => {
    const result: JSX.Element[] = [];
    bundles.forEach(b => {
      const bundle = b;
      result.push(
        <tr className="bundleRow" key={`b-${b.id}`}>
          <td>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditBundle(b); }} >
              <i className="fas fa-file-archive"></i> {b.name}
            </a>
          </td>
          <td>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); setEditResource({ category: bundle.name, bundleId: bundle.id }); }} >
              <i className="fas fa-plus"></i>
            </a>
          </td>
        </tr>
      );
      getResources(b.id).forEach((r: any) => result.push(r));
    });

    return result;
  };


  const getTable = () => {
    if (resources === null) return <Loading />;
    else return (
      <table className="table table-sm table-borderless" id="resourceTree">
        <tbody>{getRows()}</tbody>
      </table>
    );
  };


  const createAsset = (resourceId: string) => {
    const resourceAssets = ArrayHelper.getAll(assets || [], "resourceId", resourceId);
    setEditAsset({ resourceId: resourceId, sort: resourceAssets?.length + 1 || 1, });
  };

  const handleAssetCallback = (asset: AssetInterface) => {
    if (asset.id && !editAsset.id) createAsset(asset.resourceId);
    else setEditAsset(null);
    loadData();
  };

  const getDropDownMenu = (resourceId: string) => {
    return (
      <Dropdown.Menu>
        <a className="dropdown-item" data-cy="add-variant" href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setEditVariant({ resourceId: resourceId }); }} >
          <i className="fas fa-copy"></i> Add Variant
        </a>
        <a className="dropdown-item" data-cy="add-asset" href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); createAsset(resourceId); }} >
          <i className="fas fa-list-ol"></i> Add Asset
        </a>
      </Dropdown.Menu>
    );
  };


  const getEditContent = () => {
    return (
      <a href="about:blank" onClick={(e) => { e.preventDefault(); setEditBundle({ contentType: props.contentType, contentId: props.contentId }); }} >
        <i className="fas fa-plus"></i>
      </a>
    );
  };

  React.useEffect(() => { loadData() }, [props.contentType, props.contentId]);

  if (editVariant) return (<VariantEdit variant={editVariant} updatedCallback={() => { setEditVariant(null); loadData(); }} />);
  if (editAsset) return (<AssetEdit asset={editAsset} updatedCallback={handleAssetCallback} />);
  if (editResource) return (<ResourceEdit resource={editResource} contentDisplayName={props.contentDisplayName} updatedCallback={() => { setEditResource(null); loadData(); }} />);
  if (editBundle) return (<BundleEdit bundle={editBundle} contentDisplayName={props.contentDisplayName} updatedCallback={() => { setEditBundle(null); loadData(); }} />);
  else
    return (
      <>
        <DisplayBox id="resourcesBox" headerText={props.contentDisplayName} headerIcon="fas fa-file-archive" editContent={getEditContent()} >
          {getTable()}
        </DisplayBox>
      </>
    );
};