import React from "react";
import { loader } from 'graphql.macro';
import { useParams } from "react-router-dom";
import * as _ from 'lodash'

import BaseEdit from "../../components/Editor/Edit"

export const CREATE_MUTATION = loader('./graphql/create.gql')
export const UPDATE_MUTATION = loader('./graphql/update.gql')
export const ONE_QUERY = loader('./graphql/one.gql');

export const FIELDS = [
	{name: 'name', label:'Name', placeholder: 'Jejich Firma s.r.o', required: true},
	{name: 'street', label:'Street', placeholder: 'Willsonova', required: true},
	{name: 'zip', label:'Zip', placeholder: '12345', regexp: '[0-9](5)', required: true},
	{name: 'city', label:'City', placeholder: 'Praha 2', required: true},
	{name: 'country', label:'Country', required: true},
	{name: 'ico', label:'Ico', regexp: '[0-9](8)', required: true},
	{name: 'dic', label:'Dic', regexp: 'CZ[0-9](8)'},
	{name: 'phone', label:'Phone'},
	{name: 'www', label:'Www'}
]

export type CustomerEditType = {
    name?: string, 
    fields?: any
    createMutation?: any,
    updateMutation?: any,
    oneQuery?: any
  }

export const CustomerEdit:(obj:CustomerEditType)=>any = ({name, fields, createMutation, updateMutation, oneQuery }) => {
  let params = useParams() as any;
  
  const id = params.id !== 'create' &&  params.id

  return (<div className={`base-edit-Customer base-edit`}>
      <BaseEdit 
        id={id} 
        name={name || 'Customers'}
        fields={fields || FIELDS}
        query={{
            CREATE_MUTATION: createMutation || CREATE_MUTATION,
            UPDATE_MUTATION: updateMutation || UPDATE_MUTATION,
            QUERY: oneQuery || ONE_QUERY
        }}
      />
      </div>
  );
};

export default CustomerEdit