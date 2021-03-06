import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import { Table as BTable, Button } from 'react-bootstrap'

import { useQuery, useMutation } from '@apollo/client';
import { ListRow } from './Row';
import Loading from '../common/Loading';
import DeleteModal from '../common/DeleteModal';
import Unauthorized from '../common/Unauthorized';
import { DocumentNode } from 'graphql';
import { IFilteredField } from './RowItem';
import { TBaseEditUpdateCacheFn } from '../Editor/Edit';

export interface IFilterWithParams {
  filter?: string
  params?: string
}

export interface ITableQueries {
  ADMIN_LIST_QUERY: DocumentNode
  USER_LIST_QUERY: DocumentNode
  DELETE_MUTATION: DocumentNode
}

export interface IProjectList {
    userId?: string
    adminMode?: boolean
    filter: any
    queries: ITableQueries
    fields?: IFilteredField[]
    name: string
    showDelete?: boolean
    updateCache?:TBaseEditUpdateCacheFn
}

export const Table : React.FC<IProjectList> = ({filter, name, adminMode = false, queries, fields, showDelete, updateCache}) => {
  const [unauthorized, setUnauthorized] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteObject, setDeleteObject] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingOnDeleteDialog, setDeletingOnDeleteDialog] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>()

  const { data, refetch: userRefetch, loading: userLoading } = useQuery(adminMode? queries.ADMIN_LIST_QUERY : queries.USER_LIST_QUERY, {
    onError: (e) => {
      console.log('onError >>> ', e.message)
      if(e.message == 'GraphQL error: Unauhorized'){
        setUnauthorized(true)
      } else {
        setError(e)
      }
    }, onCompleted: (d) => {
      console.log('user: onCompleted', d)
      setLoading(false)

      // const dataFields = Object.getOwnPropertyNames(d)
      // if(dataFields.length > 0 && d[dataFields[0]].length > 0){
      //   setData(d[dataFields[0]])
      // } else {
      //   setData([])
      // }
      
    },
    variables: {filter}
  });


  

    const [
      deleteProjectMutation,
      { loading: deleteLoading, error: deleteError }
    ] = useMutation(queries.DELETE_MUTATION, {
      errorPolicy: "none",
      onCompleted: (data: any) => {
        console.log("DELETE", data.deleteProject);
        onHideDidaloDelete()
        userRefetch()
      },
      onError: (e) => {
        console.log('onError >>> ', e.message)
        if(e.message == 'GraphQL error: Unauhorized'){
          setUnauthorized(true)
        }
      },
      update:updateCache
    });

    const onHideDidaloDelete = () => {
      setShowDeleteDialog(false)
      setDeleteObject(null)
    }

    const onDelete = (obj:any) => {
      setDeletingOnDeleteDialog(false)
      setShowDeleteDialog(true)
      setDeleteObject(obj)
    }

    const doDelete = (deleteObject: any) => {
      setDeletingOnDeleteDialog(true)
      deleteProjectMutation({
        variables: {
          id: deleteObject.id
        }
      });
    }
    

    if(unauthorized) {
      return (<Unauthorized where={'projects'} />)
    }
    if (userLoading) return (<Loading what={'projects'} />);

    return (
        <div>
            
            {error && (<div>{`Error! ${error.message}`}</div>)}
            
            <BTable responsive>
              <thead>
                <tr>
                  <th>Id</th>
                  {fields?.map(f => (f!=='id' && <th>{(f as any).name ? (f as any).name : f}</th>))}
                  {adminMode && <th>User</th>}
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {
                data && data.all && data.all.length && data.all.map((projectItem:any)=>(<ListRow name={name} item={projectItem} onDelete={onDelete} fields={fields} showDelete={showDelete || adminMode}/>))
              }
              </tbody>
            
            </BTable>
            
            <DeleteModal 
                  show={showDeleteDialog} 
                  onHide={onHideDidaloDelete}
                  onDelete={doDelete}
                  category={'project'}
                  deleteObject={deleteObject}
                  deleting={deletingOnDeleteDialog}
                  />
        </div>
    )
}

export default Table