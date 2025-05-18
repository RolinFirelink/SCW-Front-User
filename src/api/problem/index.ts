import request from '@/utils/request'

enum API {
   PROBLEM_LIST = '/problem/list'
  }



export  function reqProblemList () {

    return request({
        url: `${API.PROBLEM_LIST}`,
        method: 'get'
    })
    


}