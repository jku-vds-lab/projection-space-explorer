import os
import numpy as np
import pandas as pd
from pgn2gif import chess
import re
from pathlib import Path

chrs = {
    'we': "\u25FB",
    'wp': "\u265F",
    'wr': "\u265C",
    'wn': "\u265E",
    'wb': "\u265D",
    'wk': "\u265A",
    'wq': "\u265B",
    'be': "\u25FC",
    'bp': "\u2659",
    'br': "\u2656",
    'bn': "\u2658",
    'bb': "\u2657",
    'bk': "\u2654",
    'bq': "\u2655",
}


def print_game(game, symbols=True):
    game = np.array(game).reshape(-1,8,8,13)
    for si, s in enumerate(game):
        print('move:', si)
        for y_i, y in enumerate(s):
            for x_i, x in enumerate(y):
                vec = np.array2string(x,separator='').replace('[','').replace(']','')
                st = vector_to_state(vec)
                if symbols:
                    if st == '':
                        if ((1-y_i)%2==0 and x_i%2==1) or ((1-y_i)%2==1 and x_i%2==0):
                            st = 'we'
                        else:
                            st = 'be'
                    print(chrs[st]+',',end='')
                else:
                    if st == '':
                        st = '  '
                    print(st+',',end='')
            print()
        print()
        
        
def state_to_vector(state):
    piece_dict = {
        'wr': [1,0,0,0,0,0,0,0,0,0,0,0,0],
        'wn': [0,1,0,0,0,0,0,0,0,0,0,0,0],
        'wb': [0,0,1,0,0,0,0,0,0,0,0,0,0],
        'wk': [0,0,0,1,0,0,0,0,0,0,0,0,0],
        'wq': [0,0,0,0,1,0,0,0,0,0,0,0,0],
        'wp': [0,0,0,0,0,1,0,0,0,0,0,0,0],
        'br': [0,0,0,0,0,0,1,0,0,0,0,0,0],
        'bn': [0,0,0,0,0,0,0,1,0,0,0,0,0],
        'bb': [0,0,0,0,0,0,0,0,1,0,0,0,0],
        'bk': [0,0,0,0,0,0,0,0,0,1,0,0,0],
        'bq': [0,0,0,0,0,0,0,0,0,0,1,0,0],
        'bp': [0,0,0,0,0,0,0,0,0,0,0,1,0],
        '':   [0,0,0,0,0,0,0,0,0,0,0,0,1],
    }    
    state_list = list(state.values())    
    vector = []
    for piece in state_list:
        vector.append(piece_dict[piece])
    return np.array(vector).ravel()


def vector_to_state(vector):
    vec_dict = {
        '1000000000000': "wr",
        '0100000000000': "wn",
        '0010000000000': "wb",
        '0001000000000': "wk",
        '0000100000000': "wq",
        '0000010000000': "wp",
        '0000001000000': "br",
        '0000000100000': "bn",
        '0000000010000': "bb",
        '0000000001000': "bk",
        '0000000000100': "bq",
        '0000000000010': "bp",
        '0000000000001': ""
    }
    
    return vec_dict[vector]
   
   
def game_to_vectors(file):
    game = chess.ChessGame(file)
    vectors = [state_to_vector(game.state)]
    while not game.is_finished:
        try:
            game.next()
        except:
            pass
        vectors.append(state_to_vector(game.state))
    return np.stack(vectors)
    
   
def get_moves_from_pgn(pgn, keep_x=False):
    with open(pgn) as p:
        data = p.read()
        data = re.sub(r'\{.*?\}', '', data) # Removes pgn comments
        data = re.sub(r'\[.*?\]', '', data) # removes metadata
        moves = re.findall(
            r'[a-h]x?[a-h]?[1-8]=?[BKNRQ]?|O-O-?O?|[BKNRQ][a-h1-8]?[a-h1-8]?x?[a-h][1-8]',
            data)
        if keep_x:
            return moves
        else:
            return [move.replace('x', '') for move in moves]
            

def get_metadata_from_pgn(pgn):
    with open(pgn) as p:
        data = p.read()
        
        # per mvoe metadata
        evals = re.findall(r'\[%eval (.*?)\]',data)
        clks = re.findall(r'\[%clk (.*?)\]',data)
        # add metadata for before first move
        evals = ['0']+evals
        clks = ['0:00:00'] + clks
        
        # per game metadata
        data = re.sub(r'\{.*?\}', '', data)  # Removes pgn comments
        m = re.findall(r'\[(.*) "(.*)"]',data)
        metadata_keys = [i[0] for i in m]
        metadata_values = [i[1].replace(',',';') for i in m]
        
        return dict(zip(metadata_keys, metadata_values)), evals, clks
        
        
def piece_by_game_state_position(game_matrices, game, state, position):
    x = ord(position[0]) - ord('a')
    y = 8 - int(position[1])
    idx = y*8+x
    str1 = ''.join(str(e) for e in game_matrices[game][state][idx * 13: (idx+1) * 13])
    return vector_to_state(str1)
    
    
def get_captured_piece(game_matrices, game, g_i, s_i):
    m = get_moves_from_pgn(game, keep_x=True)
    if 'x' in m[s_i]:
        piece = piece_by_game_state_position(game_matrices, g_i, s_i, m[s_i][-2:])
        return piece
        
      
def extract_individual_games_from_pgn(source, destination, lines_to_read=500000):
    Path(destination).mkdir(parents=True, exist_ok=True)

    with open(source, 'r') as f:
        all_games = ''.join([f.readline() for i in range(lines_to_read)])

    span = 2
    all_games = all_games.split("\n\n")
    split_games  = ["\n\n".join(all_games[i:i+span]) for i in range(0, len(all_games), span)]
    return split_games
    
    
def get_games_with_eval_and_clk(split_games):
    # only games that contain clk and eval metadata for moves
    filtered = []
    for game in split_games:
        if '%eval' in game and '%clk' in game:
            filtered.append(game)
    split_games = filtered

    # sometimes there are individual turns that only have a clk but no eval, discard those games
    filtered = []
    for game in split_games:
        m = re.findall(r'{ \[%clk(.*?) (.*?)\] }', game)
        if len(m) == 0:
            filtered.append(game)
    split_games = filtered
    return split_games


def get_games_played_by(games, player_name):
    return [g for g in games if '[White "'+player_name+'"]' in g or '[Black "'+player_name+'"]' in g]


def get_games_with_eval_and_clk(split_games):
    # only games that contain clk and eval metadata for moves
    filtered = []
    for game in split_games:
        if '%eval' in game and '%clk' in game:
            filtered.append(game)
    split_games = filtered

    # sometimes there are individual turns that only have a clk but no eval, discard those games
    filtered = []
    for game in split_games:
        m = re.findall(r'{ \[%clk(.*?) (.*?)\] }', game)
        if len(m) == 0:
            filtered.append(game)
    split_games = filtered
    return split_games


def store_games_as_pgn(split_games, destination):
    for i in range(len(split_games)):
        with open(destination+'/game-{:05d}.pgn'.format(i+1),'w') as f:
            f.write(split_games[i])
            
            
def get_metadata_from_pgns(game_paths):
    game_paths_checked = []
    metadata = []
    metadata_evals = []
    metadata_clks = []
    old_md_keys = None
    for id, g in enumerate(game_paths):
        try:
            game_to_vectors(g)
        except:
            pass
        else:
            game_paths_checked.append((id,g))
            metadata_dict, evals, clks = get_metadata_from_pgn(g)
            # get least common denominator among keys in all samples such that there aren't outlier samples that have more metadata than others
            md_keys = [k for k in metadata_dict]
            if old_md_keys:
                md_keys = list(set(md_keys).intersection(old_md_keys))
            old_md_keys = md_keys
            metadata.append(metadata_dict)
            metadata_evals.append(evals)
            metadata_clks.append(clks)
            
    # remove outlier metadata such that only shared metadata among all samples remains
    for d in metadata:
        keys = [k for k in d]
        dif = list(set(keys) - set(md_keys))
        for k in dif:
            d.pop(k)
            
    return game_paths_checked, metadata, metadata_evals, metadata_clks, md_keys
    
    
def game_matrices_from_pgn(pgn_folder, game_paths_checked, first_moves_filter=None):
    first_moves = [(g[0],get_moves_from_pgn(g[1])[0]) for g in game_paths_checked]
    indices = []
    if first_moves_filter is not None:
        for idx, fm in first_moves:
            if fm in first_moves_filter:
                indices.append(idx)
    else:
        for idx, fm in first_moves:
            indices.append(idx)
    games_pgn = [pgn_folder+'/game-{:05d}.pgn'.format(n+1) for n in np.array(indices)]
    game_matrices = [game_to_vectors(g) for g in games_pgn]
    # last game state is duplicated, remove that
    game_matrices = remove_duplicate_last_state(game_matrices)
    return game_matrices, games_pgn
    
  
def remove_duplicate_last_state(game_matrices):
    # game matrices is num_games * num_turns * 832 
    for game in range(len(game_matrices)):
        # check for each game whether last 2 game states are equivalent
        if np.all(game_matrices[game][-2] == game_matrices[game][-1]):
            # if so, remove the last state
            game_matrices[game] = game_matrices[game][:-1]
    return game_matrices
    
    
def get_eco_df(path):
    eco_a_df = pd.read_csv(path+'/a.tsv', sep='\t', header=0)
    eco_b_df = pd.read_csv(path+'/b.tsv', sep='\t', header=0)
    eco_c_df = pd.read_csv(path+'/c.tsv', sep='\t', header=0)
    eco_d_df = pd.read_csv(path+'/d.tsv', sep='\t', header=0)
    eco_e_df = pd.read_csv(path+'/e.tsv', sep='\t', header=0)
    return pd.concat([eco_a_df, eco_b_df, eco_c_df, eco_d_df, eco_e_df])
    
   
def create_opening_categories_feature(metadata):
    for m in metadata:
        if m['ECO'][0] == 'A':
            m['Opening Category'] = 'A - Flank Opening'
        elif m['ECO'][0] == 'B':
            m['Opening Category'] = 'B - Semi-Open Games other than the French Defense'
        elif m['ECO'][0] == 'C':
            m['Opening Category'] = 'C - Open Games and the French Defense'
        elif m['ECO'][0] == 'D':
            m['Opening Category'] = 'D - Closed Games and Semi-Closed Games'
        elif m['ECO'][0] == 'E':
            m['Opening Category'] = 'E - Indian Defenses'
    return metadata
    
    
def filter_unknown_ecos(eco_df, game_matrices, metadata, metadata_evals, metadata_clks, games):
    pattern = r'.\..'
    to_delete = []
    for id, gm in enumerate(game_matrices):
        filtered_df = eco_df.loc[eco_df['name'] == metadata[id]['Opening'].replace(';',',')]
        if filtered_df.empty:
            to_delete += [id]

    for idx in sorted(to_delete, reverse=True):
        del game_matrices[idx]
        del metadata[idx]
        del metadata_evals[idx]
        del metadata_clks[idx]
        del games[idx]
        
    return game_matrices, metadata, metadata_evals, metadata_clks, games
    
    
def cut_off_games_after_opening(game_matrices, eco_df, metadata):
    # pattern used to remove turn numbers such that we can determine amount of moves
    pattern = r'.\..'
    for id, gm in enumerate(game_matrices):
        # print(metadata[id]['Opening'].replace(';',','))
        filtered_df = eco_df.loc[eco_df['name'] == metadata[id]['Opening'].replace(';',',')]
        moves = filtered_df['pgn'].iloc[0]
        moves = (re.sub(pattern, '', moves))
        n_moves = len(moves.split(' '))
        # +1 because the 0th is before any moves have happened
        game_matrices[id] = game_matrices[id][:n_moves+1]
    return game_matrices
    
    
def reshape_embedding(embedding, game_matrices):
    return np.array_split(embedding, np.add.accumulate([len(l) for l in game_matrices]))[:-1]
    

def get_captures(game_matrices, games_pgn):
    captures = []

    for gameIndex, game in enumerate(game_matrices):
        captures.append([])
        # iterate games
        capture_dict = {}
        # every game initialize dictionary that says no piece has been captured (this means we can't load incomplete games)
        for piece in 'bb,bk,bn,bp,bq,br,wb,wk,wn,wp,wq,wr'.split(','):
            capture_dict[piece] = 0
            
        for idx, pos in enumerate(game):
        # iterate moves
            captures[gameIndex].append([])
        
            if idx > 0:
                captured = get_captured_piece(game_matrices, games_pgn[gameIndex], gameIndex, idx-1)            
                
                if captured:
                    capture_dict[captured] = capture_dict[captured] + 1
                # write capture dict
            temp = []
            for piece in 'bb,bk,bn,bp,bq,br,wb,wk,wn,wp,wq,wr'.split(','):
                temp += [capture_dict[piece]]
            captures[gameIndex][idx]=temp
    return captures, capture_dict
    
    
def write_csv(file_name, md_keys, embedding_split, game_matrices, metadata, captures=None, metadata_evals=None, metadata_clks=None):
    # write header
    csv = open(file_name, "w")
    features = "x,y,line,cp,algo,player,age,"
    # print(md_keys)
    features += ','.join(md_keys)
    features += ",eval,clk,a8,b8,c8,d8,e8,f8,g8,h8,a7,b7,c7,d7,e7,f7,g7,h7,a6,b6,c6,d6,e6,f6,g6,h6,a5,b5,c5,d5,e5,f5,g5,h5,a4,b4,c4,d4,e4,f4,g4,h4,a3,b3,c3,d3,e3,f3,g3,h3,a2,b2,c2,d2,e2,f2,g2,h2,a1,b1,c1,d1,e1,f1,g1,h1"
    if captures:
        features += ',bb,bk,bn,bp,bq,br,wb,wk,wn,wp,wq,wr'.replace(',',',captured_')
    csv.write(features)
    csv.write("\n")
    idx = 0

    # for gameIndex, game in enumerate(embedding_split[:450]):
    for gameIndex, game in enumerate(embedding_split):
        pi = 0
        for idx, pos in enumerate(game):
            csv.write(str(pos[0]))
            csv.write(",")
            csv.write(str(pos[1]))
            
            # number of game
            csv.write(",")
            csv.write(str(gameIndex))
            
            # checkpoint
            csv.write(",")
            if idx == 0:
                csv.write("1")
            elif idx == len(game) - 1:
                csv.write("1")
            else:
                csv.write("0")
            
            
            
            # 'algo', i.e., path coloring method
            csv.write(",")
            # using opening category from A through E
            csv.write(metadata[gameIndex]['Opening Category'])
            # in this case the winner
            # winner = metadata[gameIndex]['Result']
            # winner = winner.replace('1-0', metadata[gameIndex]['White'])
            # winner = winner.replace('0-1', metadata[gameIndex]['Black'])
            # csv.write(winner)

            # player - whose turn is it
            csv.write(",")
            if idx % 2 == 0:
                csv.write(metadata[gameIndex]['Black'])
            else:
                csv.write(metadata[gameIndex]['White'])
            
            # age
            csv.write(",")
            csv.write(str(idx))
            csv.write(",")
            
            # per game metadata
            md_values = [metadata[gameIndex][k] for k in md_keys]
            csv.write(','.join(md_values))
            # write metadata gameIndex idx %clk and %eval
            
            # per move metadata
            if metadata_evals:
                csv.write(',')
                if idx < len(metadata_evals[gameIndex]):
                    csv.write(metadata_evals[gameIndex][idx])
            if metadata_clks:
                csv.write(',')
                if idx < len(metadata_clks[gameIndex]):
                    csv.write(metadata_clks[gameIndex][idx])
            
            for n in range(0, 64):
                csv.write(",")
                str1 = ''.join(str(e) for e in game_matrices[gameIndex][idx][n * 13: (n+1) * 13])
                csv.write(vector_to_state(str1))
                
            # captured pieces
            if captures:
                csv.write(',')
                # bb,bk,bn,bp,bq,br,wb,wk,wn,wp,wq,wr
                # update capture dict
                for p_idx, piece in enumerate('bb,bk,bn,bp,bq,br,wb,wk,wn,wp,wq,wr'.split(',')):
                    csv.write(str(captures[gameIndex][idx][p_idx]))
                    csv.write(',')
                
            csv.write("\n")
        gameIndex += 1
            
    csv.close()
    
    
def store_embedding_over_existing_file(source, embedding, destination):
    df = pd.read_csv(source, header=0, index_col=False)
    df.reset_index(drop=True, inplace=True)
    df['x'] = embedding[:,0]
    df['y'] = embedding[:,1]
    df.to_csv(destination)
    

def all_zeros_embedding_shape(game_matrices):
    embedding_split = []
    for i, game in enumerate(game_matrices):
        embedding_split += [[[0, 0] for move in game]]
    return embedding_split
    
    
def find_duplicates(path):
    df = pd.read_csv(path, header=0, index_col=False)
    df.reset_index(drop=True, inplace=True)
    features = ['a8','b8','c8','d8','e8','f8','g8','h8','a7','b7','c7','d7','e7','f7','g7','h7','a6','b6','c6','d6','e6','f6','g6','h6','a5','b5','c5','d5','e5','f5','g5','h5','a4','b4','c4','d4','e4','f4','g4','h4','a3','b3','c3','d3','e3','f3','g3','h3','a2','b2','c2','d2','e2','f2','g2','h2','a1','b1','c1','d1','e1','f1','g1','h1']
    dup_df = df[df.duplicated(features)]
    drop_dup_df = df.drop_duplicates(subset=features)
    return dup_df, drop_dup_df
    
    
def merge_embeddings_with_duplicate_states(dup_df, drop_dup_df, embedding):
    features = ['a8','b8','c8','d8','e8','f8','g8','h8','a7','b7','c7','d7','e7','f7','g7','h7','a6','b6','c6','d6','e6','f6','g6','h6','a5','b5','c5','d5','e5','f5','g5','h5','a4','b4','c4','d4','e4','f4','g4','h4','a3','b3','c3','d3','e3','f3','g3','h3','a2','b2','c2','d2','e2','f2','g2','h2','a1','b1','c1','d1','e1','f1','g1','h1']
    drop_dup_df=drop_dup_df.drop(['x', 'y'], axis=1)
    drop_dup_df.insert(0, "x", embedding[:,0], True)
    drop_dup_df.insert(1, "y", embedding[:,1], True)

    state_to_coords = {}

    for i, row in drop_dup_df.iterrows():
        values = row[features]
        k = ''.join([str(x) for x in values.tolist()])
        state_to_coords[k] = [row['x'], row['y']]
        
    dup_df=dup_df.drop(['x', 'y'], axis=1)
    xs = []
    ys = []
    for i, row in dup_df.iterrows():
        values = row[features]
        k = ''.join([str(x) for x in values.tolist()])
        x, y = state_to_coords[k]
        xs += [x]
        ys += [y]
    dup_df.insert(0, 'x', xs, True)
    dup_df.insert(1, 'y', ys, True)

    concat_df = pd.concat([drop_dup_df, dup_df])
    concat_df.sort_index(inplace=True)
    return concat_df
    