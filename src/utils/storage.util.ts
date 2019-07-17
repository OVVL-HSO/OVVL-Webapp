import {State} from "../store";
import {DFDModel} from "../models/modelling-related/dfd.model";
import {Interactor} from "../models/modelling-related/interactor.model";
import {GenericElementType} from "../models/modelling-related/base.model";
import {Process} from "../models/modelling-related/process.model";
import {DataStore} from "../models/modelling-related/datastore.model";
import {ElementUtil} from "./element.util";
import {BaseModelStorageData, ModelStorageData} from "../models/user-related/storage.model";
import {Project} from "../models/user-related/project.model";
import {GeneralUtil} from "./general.util";
import {DataFlow} from "../models/modelling-related/dataflow.model";

export class StorageUtil {

  static convertStateToSaveableDFD(state: State, storageMetaData: BaseModelStorageData): DFDModel {
    const interactors: Interactor[] = ElementUtil
      .findElementsOfSameType<Interactor>(state.elementState.present.dfdElements, GenericElementType.INTERACTOR);
    const processes: Process[] = ElementUtil
      .findElementsOfSameType<Process>(state.elementState.present.dfdElements, GenericElementType.PROCESS);
    const dataStores: DataStore[] = ElementUtil
      .findElementsOfSameType<DataStore>(state.elementState.present.dfdElements, GenericElementType.DATASTORE);
    return {
      interactors: interactors,
      dataFlows: state.elementState.present.dataFlows,
      dataStores: dataStores,
      processes: processes,
      trustBoundaries: state.elementState.present.trustBoundaries,
      storageData: storageMetaData
    };
  }

  static getEmptyBaseModelStorageData(screenshotBase64: string): BaseModelStorageData {
    return {
      name: "",
      summary: "",
      screenshot: screenshotBase64,
      projectID: ""
    };
  }

  static sortProjectsByDateNewestFirst(projects: Project[]): Project[] {
    return projects.sort((a, b) => GeneralUtil.substractTwoDates(b.creationDate, a.creationDate));
  }

  static sortModelDataByDateNewestFirst(modelData: ModelStorageData[]): ModelStorageData[] {
    return modelData.sort((a, b) => GeneralUtil.substractTwoDates(b.date, a.date));
  }

  static storageDataContainsAllRequiredInfo(modelStorageData: BaseModelStorageData): boolean {
    return !!modelStorageData.summary
      && !!modelStorageData.name
      && !!modelStorageData.screenshot
      // Same validation as in backend
      && modelStorageData.summary.length > 5 && modelStorageData.summary.length < 300
      && modelStorageData.name.length > 3 && modelStorageData.name.length < 25;
  }
}
