import {Interactor} from '../../models/modelling-related/interactor.model';
import {Process} from '../../models/modelling-related/process.model';
import {DataStore} from '../../models/modelling-related/datastore.model';
import {DFDModelDTO} from "../../models/modelling-related/dfd.model";
import {GenericElementType} from "../../models/modelling-related/base.model";
import {ElementUtil} from "../element.util";
import {DataFlowUtil} from "../data-flow.util";
import {DFDElementState} from "../../store/reducer/modelling-related/dfd-element.reducer";

export class AnalysisUtils {

  static convertDFDStateToDFDDTO(elementState: DFDElementState): DFDModelDTO {
    const interactors: Interactor[] = ElementUtil
      .findElementsOfSameType<Interactor>(elementState.dfdElements, GenericElementType.INTERACTOR);
    const processes: Process[] = ElementUtil
      .findElementsOfSameType<Process>(elementState.dfdElements, GenericElementType.PROCESS);
    const dataStores: DataStore[] = ElementUtil
      .findElementsOfSameType<DataStore>(elementState.dfdElements, GenericElementType.DATASTORE);
    return {
      interactors: ElementUtil.convertDFDElementsToDTOs(interactors),
      dataStores: ElementUtil.convertDFDElementsToDTOs(dataStores),
      processes: ElementUtil.convertDFDElementsToDTOs(processes),
      dataFlows: DataFlowUtil.convertDataFlowsToDTOs(elementState.dataFlows),
      trustBoundaries: elementState.trustBoundaries,
      modelID: elementState.modelID ? elementState.modelID : ""
    };
  }
}
