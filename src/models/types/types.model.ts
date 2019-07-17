import {Interactor} from "../modelling-related/interactor.model";
import {Process} from "../modelling-related/process.model";
import {DataStore} from "../modelling-related/datastore.model";
import {DataFlow} from "../modelling-related/dataflow.model";
import {TrustBoundary} from "../modelling-related/trust-boundary.model";

export type DFDElementType = Interactor | Process | DataStore;
export type DFDComponent = DFDElementType | DataFlow | TrustBoundary;
