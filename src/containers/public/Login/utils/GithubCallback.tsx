import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useHistory, useLocation } from 'react-router-dom'
import _ from 'lodash'
import { Alert } from 'react-bootstrap'
import { getProtectQLRoot } from '../../../../app/utils'
import { useAppDispatch } from '../../../../app/hooks'
import { login, UserToken } from '../../../../app/reducers/userSlice'
import { setupOrganizationFromUser } from '../../../../app/reducers/organizationSlice'

export const tokenFromFacebookCode = async (type:string, code: string) => {
    return axios.get(`${getProtectQLRoot()}/auth/${type}/callback?code=${code}`)
}

export const GithubCallback: React.FC<{type: string}> = ({type}) => {
    const location = useLocation()
    const codeRaw = _.get(location, 'search', '').split('?code=')
    const code = codeRaw.length > 1 ? codeRaw[1] : ''


    const history = useHistory()
    const dispatch = useAppDispatch();

    const [error, setError] = useState<string>()

    const showError = (errorMessage:string) => {
        setError(errorMessage)
        setTimeout(()=>{
            history.replace('/login')
        }, 4000)
    }
    useEffect(()=>{
        const request = async () => {
            try {
                const data = await tokenFromFacebookCode(type, code)
                dispatch(login(data as any))
                dispatch(setupOrganizationFromUser((data as any).user))
                history.replace('/user/projects')
            } catch(ex) {
                const response = JSON.parse(_.get(ex, 'request.response', '{}'))
                showError(response.error?.message || ex.message)
            }
            
           
        }

        if(code) request()
        else showError('User denied')
    }, [location])

    return (<>
        {error && <Alert variant={'danger'}>{type} login isn't work due "{error}" You will be redirect back to <Link to="/login">Login</Link></Alert>}
    </>)
}
