import bottle
from bottle.ext import beaker

session_opts = {
    'session.type': 'memory',
    'session.cookie_expires': 3600,
    'session.auto': True
}

app = beaker.middleware.SessionMiddleware(bottle.app(), session_opts)

@bottle.route('/test')
def test():
    s = bottle.request.environ.get('beaker.session')
    s['test'] = s.get('test',0) + 1
    s.save()
    return 'Test counter: %d' % s['test']
    
    
from rdkit.Chem import PandasTools
import pandas as pd
@bottle.route('/df')
def df_test():
    df = PandasTools.LoadSDF("./temp-files/1610352673blob", embedProps=True,smilesName="SMILES",molColName='Molecule')
    #df = pd.DataFrame([{"asdf":"daf", "fdaf":"dfs"}])
    print(df)
    s = bottle.request.environ.get('beaker.session')
    s['key'] = df #pickle.dumps(df)#context.serialize(df).to_buffer().to_pybytes()
    s.save()
    print(s['key'])
    return "ok"
    
@bottle.route('/readdf')
def df_test_read():
    s = bottle.request.environ.get('beaker.session')
    print("-------", s['key'])
    df = s['key'] #pickle.loads(s['key'])#context.deserialize(session['key'])
    print(df)
    return "ok"


bottle.run(app=app)


##!/usr/bin/env python
#import bottle_session
#import bottle_redis
#import bottle
#import redis
#from datetime import datetime
#import pyarrow as pa
#import pickle
#
#app = bottle.app()
#session_plugin = bottle_session.SessionPlugin()
#redis_plugin = bottle_redis.RedisPlugin()
#
#connection_pool = redis.ConnectionPool(host='localhost', port=6379)
#
#session_plugin.connection_pool = connection_pool
#redis_plugin.redisdb = connection_pool
#app.install(session_plugin)
#app.install(redis_plugin)
#
#context = pa.default_serialization_context()
#
#@bottle.route('/')
#def index(session,rdb):
#    rdb.incr('visitors')
#    visitor = rdb.get('visitors')
#    last_visit = session['visit']
#    session['visit'] = datetime.now().isoformat()
#
#    return 'You are visitor %s, your last visit was on %s'%(visitor,last_visit)
#    
#    
#from rdkit.Chem import PandasTools
#import pandas as pd
#@bottle.route('/df')
#def df_test(session,rdb):
#    #df = PandasTools.LoadSDF("./temp-files/1610092968blob", embedProps=True,smilesName="SMILES",molColName='Molecule')
#    df = pd.DataFrame([{"asdf":"daf", "fdaf":"dfs"}])
#    print(df)
#    rdb.set("key", context.serialize(df).to_buffer().to_pybytes())
#    session['key'] = pickle.dumps(df)#context.serialize(df).to_buffer().to_pybytes()
#    print(session['key'])
#    return "ok"
#    
#@bottle.route('/readdf')
#def df_test_read(session,rdb):
#    #df = context.deserialize(rdb.get("key"))
#    print("-------", session['key'])
#    df = pickle.loads(session['key'])#context.deserialize(session['key'])
#    print(df)
#    return "ok"
#
#bottle.debug(True)
#bottle.run(app=app,host='localhost',port=8080)
#
## docker run --name my-redis-container -p 6379:6379 -d redis